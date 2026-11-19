---
title: Air-Gapped Networks: When Total Isolation Is Worth the Pain
excerpt: What a real air gap is, where it's justified (industrial control, classified and backup systems), how air gaps get bridged in practice, and the operational controls that keep isolation meaningful.
---

An air-gapped network has no connection to the internet or to less-trusted networks: no cables, no wireless, no "temporary" VPN. It's the strongest form of network isolation, and also one of the most expensive to operate properly.

## Where it's justified

- **Industrial control and safety systems** where compromise could cause physical harm.
- **Classified or highly sensitive environments** with regulatory requirements.
- **Offline backup copies**, the last-resort copy that ransomware can't reach.
- **Critical signing infrastructure**, such as an offline root certificate authority; see [PKI basics](/article/pki-certificate-authority-explained).

For most business systems, strong segmentation and monitoring give better value than a true air gap.

## How air gaps get bridged

History shows isolation is rarely absolute:

- **Removable media**: Stuxnet reached isolated systems via USB drives. Updates, data exports and engineering laptops all need a way in and out.
- **Engineering and vendor laptops** that connect to both sides.
- **Undocumented connections**: a forgotten modem, a dual-homed PC, a cellular router a vendor installed for support.
- **Wireless interfaces** left enabled on devices.
- **Supply chain**: equipment arriving with compromised firmware.

## Making isolation meaningful

1. **Inventory and verify**: map every device and interface; physically check for unexpected connections and wireless.
2. **Controlled transfer process**: dedicated, scanned, write-controlled media or a one-way data diode for moving data in or out; multiple antivirus engines on a kiosk; logs of every transfer.
3. **Dedicated maintenance devices** that never touch other networks.
4. **Patching plan**: isolated systems still need updates, transferred through the controlled process and tested.
5. **Local monitoring**: logging and integrity monitoring inside the enclave; isolation doesn't remove the need to detect.
6. **Physical security**, because physical access becomes the main attack path; see [server room security](/article/physical-security-server-room-basics).

## FAQ

**Is a VLAN an air gap?**
No. VLANs share switches and can be bridged by misconfiguration. An air gap is physical separation.

**What about one-way links?**
Data diodes allow data out (for monitoring) without allowing anything back in. They're common in industrial environments.

## References

- [NIST SP 800-82 Rev. 3: Guide to Operational Technology (OT) Security](https://csrc.nist.gov/pubs/sp/800/82/r3/final)
- [CISA: Industrial Control Systems](https://www.cisa.gov/topics/industrial-control-systems)
