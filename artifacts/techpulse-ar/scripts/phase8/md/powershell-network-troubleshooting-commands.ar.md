ما زال للأمرين `ping` و`ipconfig` مكانهما، لكن أوامر PowerShell الخاصة بالشبكات تجيب عن أسئلة أكثر بتخمين أقل، ويمكن تصفية نتائجها وتصديرها واستخدامها في سكربتات. هذه قائمة مختصرة بأهم الأوامر لتشخيص مشكلات الشبكة على ويندوز، مرتبة حسب السؤال الذي تريد الإجابة عنه.

## إعدادات الجهاز

```powershell
Get-NetIPConfiguration -Detailed
Get-NetAdapter | Select-Object Name, Status, LinkSpeed, MacAddress
Get-DnsClientServerAddress -AddressFamily IPv4
Get-NetRoute -AddressFamily IPv4 | Sort-Object RouteMetric
```

الأمر الأول يعرض العنوان والبوابة وخوادم DNS لكل واجهة. العنوان الذي يبدأ بـ169.254 يعني أن DHCP فشل، وغياب البوابة يفسّر عدم الوصول إلى الشبكات الأخرى. وسرعة 100 ميجابت على شبكة جيجابت تشير إلى مشكلة في الكابل أو المنفذ. أما جدول التوجيه فيوضح أي واجهة تفوز عندما يتصل الجهاز بـVPN وWi-Fi معًا.

## هل أصل إلى الخادم وعلى أي منفذ؟

أهم أمر في هذه القائمة هو `Test-NetConnection`:

```powershell
Test-NetConnection mail.example.com -Port 587
Test-NetConnection 10.10.20.15 -Port 3389 -InformationLevel Detailed
Test-NetConnection www.example.com -TraceRoute
```

مع الخيار `-Port` تخبرك الخاصية `TcpTestSucceeded` هل نجح فتح اتصال TCP، وهذا ما لا يستطيع ping إخبارك به. كثير من الخوادم تحجب ICMP لكنها تقدم خدمتها بشكل طبيعي.

- **ping يفشل وTCP ينجح:** ICMP محجوب والخدمة سليمة.
- **ping ينجح وTCP يفشل:** الجهاز يعمل لكن الخدمة متوقفة أو جدار ناري يمنع المنفذ.
- **كلاهما يفشل:** مشكلة توجيه أو الجهاز نفسه أو جدار ناري في الطريق.

ولمشكلات المسار يجمع الأمر `pathping` بين تتبع المسار وإحصاءات فقد الحزم لكل قفزة خلال دقيقتين تقريبًا، فيفرّق بين قفزة تفقد الحزم فعلًا وراوتر يؤخر الرد على ICMP فقط.

## هل المشكلة في DNS؟

```powershell
Resolve-DnsName intranet.example.com -Server 10.0.0.10
Clear-DnsClientCache
```

مقارنة الإجابة الافتراضية بإجابة خادم محدد تفصل بين «خادم خاطئ» و«سجل خاطئ». التفاصيل في [دليل تشخيص DNS](/article/dns-troubleshooting-nslookup-dig).

## ما الذي يستمع على الجهاز ومن المتصل به؟

```powershell
Get-NetTCPConnection -State Listen | Sort-Object LocalPort
```

العمود OwningProcess يعطيك رقم العملية، ثم تعرف اسمها بالأمر `Get-Process -Id` متبوعًا بالرقم.

ربط المنافذ بالعمليات يجيب عن سؤال «لماذا المنفذ 8080 مفتوح؟» ويساعد في التحقيقات. راجع [مرجع المنافذ الشائعة](/article/common-network-ports-cheat-sheet).

## الجدار الناري المحلي

```powershell
Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction
```

وبدل إيقاف الجدار الناري لحل المشكلة، اكتب قاعدة صحيحة كما في [قواعد جدار ويندوز المتقدمة](/article/windows-firewall-advanced-rules).

## الإصلاحات السريعة في وقتها

`Restart-NetAdapter` و`ipconfig /renew` ومسح ذاكرة DNS حلول مفيدة، لكن نفّذها بعد جمع الأدلة السابقة، وإلا قد تختفي المشكلة دون أن تعرف سببها، ثم تعود لاحقًا.

## سكربت فحص في شاشة واحدة

```powershell
$target = 'fileserver01'
Get-NetIPConfiguration
Resolve-DnsName $target
Test-NetConnection $target -Port 445
```

ثلاثة أسطر فقط تغطي الإعدادات ثم الأسماء ثم الوصول إلى خدمة مشاركة الملفات. احفظها في ملف وأعطها لفريق الدعم الفني، واطلب منهم إرفاق المخرجات كاملة مع كل بلاغ عن انقطاع الشبكة،  فمخرجاته تمنح فريق الشبكات معظم ما يحتاجه من أول تحديث للبلاغ. وللتوسع راجع [دليل PowerShell لمسؤولي الأنظمة](/article/powershell-sysadmin-complete-guide).

## الأسئلة الشائعة

### هل يتوفر Test-NetConnection في كل إصدارات ويندوز؟

هو جزء من الوحدة NetTCPIP منذ Windows 8 وWindows Server 2012. وفي PowerShell 7 يقدم `Test-Connection -TcpPort` فحصًا مشابهًا.

### لماذا يتأخر الأمر عندما يكون المنفذ مغلقًا؟

لأنه ينتظر انتهاء مهلة الاتصال، وهذا التأخير نفسه يدل على أن الحركة تُسقط بصمت بدل أن تُرفض.

### هل يمكن تشغيل هذه الأوامر على أجهزة بعيدة؟

كثير منها يقبل الخيار `-CimSession`، أو يمكن تشغيلها عبر PowerShell Remoting باستخدام `Invoke-Command`، فتفحص عشرات الأجهزة دفعة واحدة وتجمع النتائج في ملف CSV واحد للمراجعة.

## المراجع

- [Microsoft Learn: Test-NetConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection)
- [Microsoft Learn: Get-NetIPConfiguration](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-netipconfiguration)
- [Microsoft Learn: Get-NetTCPConnection](https://learn.microsoft.com/en-us/powershell/module/nettcpip/get-nettcpconnection)
- [Microsoft Learn: pathping](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/pathping)
