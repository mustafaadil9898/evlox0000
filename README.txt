
طريقة التركيب (بدون ما تغيّر أي شي من هيكل الموقع):
1) ارفع الملفين إلى **جذر** الريبو (نفس مكان index.html):
   - rules-injector.js
   - price-override.js
2) افتح index.html، وأضف قبل </body> مباشرة:
   <script src="rules-injector.js"></script>
   <script src="price-override.js"></script>

- الأول يضيف قسم Rules & FAQ تلقائيًا (أكورديون).
- الثاني يحدّث الأسعار حسب طلبك.
- ما يغيّر أي عنصر آخر بالموقع.
