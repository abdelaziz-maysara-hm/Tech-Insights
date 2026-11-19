A switching loop can take down an entire office in seconds: link lights flash solid, switches peg their CPUs, phones drop and nobody can reach anything. Spanning Tree Protocol (STP) exists to prevent this, but a single misplaced cable, a desk switch or a misconfigured port can still slip through. Here is how to recognise a loop, stop it quickly and prevent the next one. Examples use Cisco IOS syntax; other vendors offer equivalent features.

## Why loops are so destructive

Ethernet frames have no time-to-live field. If a broadcast frame finds a loop, switches forward it around forever, copying it at every turn. Within moments the broadcast traffic saturates links and switch CPUs, and MAC address tables churn as the same source address appears on different ports. That combination is a **broadcast storm**.

STP blocks redundant paths so that only one active path exists between any two points. Loops happen when STP is disabled, when a port starts forwarding before STP has checked it, or when a device that doesn't speak STP bridges two ports together.

## Recognising a loop

- Network-wide slowness or outage starting suddenly, often right after someone plugged something in.
- Switch CPU very high; management sessions sluggish or impossible.
- Interface counters showing huge broadcast or multicast rates.
- Log messages about MAC addresses **flapping** between ports, for example `%SW_MATM-4-MACFLAP_NOTIF: Host ... is flapping between port Gi1/0/5 and port Gi1/0/6`.
- STP topology change counters rising quickly.

Useful commands:

```text
show spanning-tree vlan 10
show spanning-tree detail | include ieee|occurr|from|is exec
show interfaces counters
show logging | include FLAP
show mac address-table address aaaa.bbbb.cccc
```

## Stopping it fast

1. **Find the ports involved.** MAC-flap messages and interface counters point to the ports where the storm enters. Follow them towards the edge.
2. **Shut the suspect access port** (`shutdown` on the interface). If the storm stops, you've found it.
3. **Walk to the physical location** if needed: an unmanaged desk switch with two cables to the wall, or a patch cable looped between two wall ports, is a classic cause.
4. **Bring ports back one by one** after removing the cause, watching CPU and counters.

If you can't reach the switches at all, disconnecting uplinks between access switches one at a time isolates the affected segment.

## Preventing the next loop

**PortFast with BPDU Guard on every access port.** PortFast lets end-device ports forward immediately, skipping STP's listening and learning states. BPDU Guard shuts the port (err-disabled) the moment a BPDU arrives, which means someone connected a switch where only a PC belongs.

```text
interface range GigabitEthernet1/0/1 - 44
 spanning-tree portfast
 spanning-tree bpduguard enable
!
! or globally for all PortFast ports:
spanning-tree portfast bpduguard default
```

Only use PortFast on ports that connect to single end stations. On a port leading to another switch, it removes the very protection STP provides.

**Decide where the root bridge lives.** Left alone, STP elects the switch with the lowest bridge ID, which might be an old access switch. Set the core or distribution switch as root deliberately (`spanning-tree vlan 10 root primary` or an explicit low priority) and use **Root Guard** on ports where a root should never appear.

**Storm control.** Rate-limit broadcast traffic on access ports so one port can't flood the network:

```text
interface GigabitEthernet1/0/5
 storm-control broadcast level 1.00
 storm-control action shutdown
```

Tune thresholds to your environment; an over-strict value can block legitimate traffic.

**Automatic recovery, carefully.** Err-disabled ports stay down until an admin intervenes. `errdisable recovery cause bpduguard` re-enables them after an interval, which helps remote sites but can hide a recurring problem. Log and alert on err-disable events either way.

**Never disable STP** to "fix" a problem, and prefer Rapid PVST+ or MST over legacy 802.1D for faster convergence.

Loops are also a reason to keep networks segmented: a storm in one VLAN stays in that VLAN. See [VLAN basics](/article/vlan-basics-why-segment) and [SNMP monitoring basics](/article/snmp-monitoring-basics) for catching CPU and interface spikes early.

## FAQ

### Can a loop happen with a single cable?

Yes. A cable between two ports of the same unmanaged switch, or between two wall ports patched to the same switch, is enough.

### Why did BPDU Guard shut down a port with just a PC on it?

Some devices bridge interfaces, such as a PC running a virtual switch or a phone with a built-in switch misconfigured. Check what is connected before re-enabling.

### Does storm control replace STP?

No. It limits damage; STP and BPDU Guard prevent the loop in the first place.

## References

- [Cisco: Understand Spanning Tree PortFast and BPDU Guard Features](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/10586-65.html)
- [Cisco: Recover Errdisable Port State on Cisco IOS Platforms](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/69980-errdisable-recovery.html)
