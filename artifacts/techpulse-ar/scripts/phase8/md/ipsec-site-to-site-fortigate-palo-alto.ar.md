## السيناريو

فرع يعمل بجدار FortiGate ومقر رئيسي يعمل بجدار Palo Alto، والمطلوب ربط الشبكتين بنفق IPsec دائم. الربط بين موردين مختلفين ينجح بسهولة إذا اتفق الطرفان على المعاملات نفسها بالضبط، ويفشل بطرق محيّرة إذا اختلف معامل واحد. لذلك نبدأ بورقة مشتركة.

## الخطوة 0: ورقة المعاملات المشتركة

| المعامل | القيمة في هذا المثال |
|---|---|
| إصدار IKE | IKEv2 |
| المصادقة | Pre-shared key طويل (32 حرفًا على الأقل) |
| تشفير المرحلة الأولى | AES-256 / SHA-256 / DH group 14 |
| تشفير المرحلة الثانية | AES-256 / SHA-256 / PFS group 14 |
| عمر المرحلة الأولى | 28800 ثانية (8 ساعات) |
| عمر المرحلة الثانية | 3600 ثانية (ساعة) |
| شبكة الفرع | 10.20.0.0/16 |
| شبكة المقر | 10.10.0.0/16 |
| عنوان FortiGate العام | 198.51.100.20 |
| عنوان Palo Alto العام | 203.0.113.10 |

القيم الافتراضية للأعمار تختلف بين المنتجين، لذلك اكتبها صراحة على الطرفين بدل الاعتماد على الافتراضي. استخدم مجموعات DH أحدث (19 أو 20) إن كان الطرفان يدعمانها.

## الإعداد على FortiGate

```
config vpn ipsec phase1-interface
    edit "to-HQ"
        set interface "wan1"
        set ike-version 2
        set peertype any
        set proposal aes256-sha256
        set dhgrp 14
        set keylife 28800
        set remote-gw 203.0.113.10
        set psksecret <المفتاح-المشترك>
    next
end
config vpn ipsec phase2-interface
    edit "to-HQ-p2"
        set phase1name "to-HQ"
        set proposal aes256-sha256
        set dhgrp 14
        set keylifeseconds 3600
        set src-subnet 10.20.0.0 255.255.0.0
        set dst-subnet 10.10.0.0 255.255.0.0
    next
end
config router static
    edit 0
        set dst 10.10.0.0 255.255.0.0
        set device "to-HQ"
    next
end
```

ثم أنشئ سياستين: من LAN إلى واجهة النفق `to-HQ`، ومن `to-HQ` إلى LAN، بدون NAT.

## الإعداد على Palo Alto

بالترتيب في واجهة الويب:

1. **Network > Interfaces > Tunnel:** أنشئ `tunnel.10` وضعه في Virtual Router وفي منطقة جديدة باسم `vpn-branch`.
2. **Network > Network Profiles > IKE Crypto:** AES-256، SHA-256، DH group14، العمر 8 ساعات.
3. **IPSec Crypto:** ESP، AES-256، SHA-256، PFS group14، العمر ساعة.
4. **IKE Gateways:** الإصدار IKEv2 only، الواجهة الخارجية، عنوان الطرف 198.51.100.20، المفتاح المشترك.
5. **IPSec Tunnels:** اربط `tunnel.10` بالبوابة وملف IPSec Crypto، وفي تبويب **Proxy IDs** أضف Local `10.10.0.0/16` وRemote `10.20.0.0/16`.
6. **Virtual Router > Static Routes:** المسار `10.20.0.0/16` عبر `tunnel.10`.
7. **Policies > Security:** قاعدتان بين `trust` و`vpn-branch` في الاتجاهين، مع التأكد من عدم وجود قاعدة NAT تترجم هذه الحركة.

## لماذا Proxy-ID مهم هنا؟

Palo Alto يعمل افتراضيًا بنفق قائم على التوجيه ويرسل محددات حركة 0.0.0.0/0 إن لم تحدد Proxy-ID. FortiGate في مثالنا يرسل الشبكتين المحددتين. إذا اختلفت المحددات فقد تنجح المرحلة الأولى وتفشل الثانية. الحل: إما محددات مطابقة على الطرفين كما فعلنا، أو 0.0.0.0/0 على الطرفين والاعتماد على التوجيه.

## التشخيص

**على FortiGate:**

```
diagnose vpn ike gateway list name to-HQ
diagnose vpn tunnel list name to-HQ
diagnose debug application ike -1
diagnose debug enable
```

**على Palo Alto:**

```
show vpn ike-sa gateway <اسم-البوابة>
show vpn ipsec-sa tunnel <اسم-النفق>
test vpn ike-sa gateway <اسم-البوابة>
less mp-log ikemgr.log
```

| العَرَض | السبب المرجّح |
|---|---|
| لا توجد محاولة تفاوض أصلًا | منفذ UDP 500/4500 محجوب، أو لا توجد حركة تشغّل النفق |
| المرحلة الأولى تفشل | المفتاح مختلف، أو اقتراح التشفير أو مجموعة DH مختلفة |
| المرحلة الثانية تفشل | محددات الحركة (Proxy-ID) أو PFS مختلفة |
| النفق قائم ولا تمر حركة | مسار ناقص، سياسة ناقصة، أو NAT يترجم حركة النفق |

## الأسئلة الشائعة

**هل أستخدم IKEv1 للتوافق؟**
لا، إلا إذا كان أحد الطرفين لا يدعم IKEv2. IKEv2 أبسط وأكثر موثوقية في إعادة التفاوض.

**هل أحتاج NAT-T؟**
إذا كان أي طرف خلف NAT، نعم؛ ويتفاوض عليه الطرفان تلقائيًا عادة عبر UDP 4500.

**هل يمكن إضافة نفق احتياطي؟**
نعم، بنفق ثانٍ على خط إنترنت آخر مع مراقبة النفق ومسارات بأولويات مختلفة أو SD-WAN على FortiGate.

لمزيد عن أساسيات VPN راجع [ما الذي تفعله VPN فعلًا](/article/vpn-basics-what-it-does).

## المراجع

- [General IPsec VPN configuration — FortiOS 7.6 (Fortinet)](https://docs.fortinet.com/document/fortigate/7.6.0/administration-guide/762500/ipsec-vpns)
- [Configure IPSec VPN Tunnels (Site-to-Site) — Palo Alto Networks](https://docs.paloaltonetworks.com/network-security/ipsec-vpn/administration/set-up-site-to-site-vpn)
