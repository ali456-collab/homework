// لنضمن أن الكود سيبدأ العمل فقط بعد تحميل محتوى الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
  // تحديد العناصر التي سوف نحتاجها
  const orderForm = document.getElementById('orderForm');
  const continueButton = document.getElementById('continueButton');
  const radioButtons = document.querySelectorAll('input[type="radio"][name="options"]');
  const form = document.getElementById('purchaseForm');
  const captchaCode = document.getElementById('captchaCode');
  const refreshCaptchaBtn = document.getElementById('refreshCaptcha');
  const cancelOrderBtn = document.getElementById('cancelOrder');

  // لإخفاء التفاصيل بشكل افتراضي
  const detailsRows = document.querySelectorAll('.details');
  detailsRows.forEach(row => row.style.display = 'none');

  // عرض التفاصيل المختارة
  window.toggleDetails = function(checkbox, detailsId) {
      const detailsRow = document.getElementById(detailsId);
      if (detailsRow) {
          detailsRow.style.display = checkbox.checked ? 'table-row' : 'none';
      }
  };

  // تفعيل زر المتابعة فقط عندما نختار احد الكتب
  radioButtons.forEach(radio => {
      radio.addEventListener('change', function() {
          continueButton.disabled = false;
      });
  });

  // عرض الفورم
  continueButton.addEventListener('click', function() {
      orderForm.classList.remove('hidden');
      generateCaptcha();
      orderForm.scrollIntoView({ behavior: 'smooth' });
  });

  // توليد رمز الكابتشا
  function generateCaptcha() {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      let captcha = '';
      for (let i = 0; i < 6; i++) {
          captcha += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      captchaCode.textContent = captcha;
  }

  // تحديث رمز الكابتشا
  refreshCaptchaBtn.addEventListener('click', generateCaptcha);

  // التحقق من صحة المدخلات
  function validateNationalId(value) {
      return /^(0[1-9]|1[0-4])\d{9}$/.test(value);
  }

  function validateArabicName(value) {
      return /^[\u0621-\u064A\s]+$/.test(value);
  }

  function validateMobile(value) {
      return /^09(3|4|5|6|8|9)\d{7}$/.test(value);
  }

  function validateEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', function(e) {
      e.preventDefault();

      const nationalId = document.getElementById('nationalId').value;
      const name = document.getElementById('name').value;
      const birthDate = document.getElementById('birthDate').value;
      const mobile = document.getElementById('mobile').value;
      const email = document.getElementById('email').value;
      const captchaInput = document.getElementById('captcha').value;

      // التحقق من الحقول
      let isValid = true;
      let errorMessage = '';

      if (!validateNationalId(nationalId)) {
          errorMessage += 'الرجاء إدخال رقم وطني صحيح\n';
          isValid = false;
      }

      if (!validateArabicName(name)) {
          errorMessage += 'الرجاء إدخال الاسم باللغة العربية\n';
          isValid = false;
      }

      if (!birthDate) {
          errorMessage += 'الرجاء إدخال تاريخ الميلاد\n';
          isValid = false;
      }

      if (!validateMobile(mobile)) {
          errorMessage += 'الرجاء إدخال رقم موبايل صحيح\n';
          isValid = false;
      }

      if (!validateEmail(email)) {
          errorMessage += 'الرجاء إدخال بريد إلكتروني صحيح\n';
          isValid = false;
      }

      if (captchaInput !== captchaCode.textContent) {
          errorMessage += 'رمز التحقق غير صحيح\n';
          isValid = false;
      }

      if (!isValid) {
          alert(errorMessage);
          return;
      }

      // الحصول على تفاصيل الكتب
      const selectedBook = document.querySelector('input[type="radio"][name="options"]:checked');
      if (selectedBook) {
          const bookRow = selectedBook.closest('tr');
          const bookTitle = bookRow.querySelector('td:nth-child(4)').textContent;
          const bookPrice = bookRow.querySelector('td:nth-child(3)').textContent;
          const bookISBN = bookRow.querySelector('th').textContent;

          alert(`تم تقديم الطلب بنجاح!\n\nتفاصيل الكتاب:\nالعنوان: ${bookTitle}\nالسعر: ${bookPrice}\nISBN: ${bookISBN}\n\nتفاصيل الطلب:\nالاسم: ${name}\nالرقم الوطني: ${nationalId}`);
          
          form.reset();
          orderForm.classList.add('hidden');
      }
  });

  // زر إلغاء الطلب
  cancelOrderBtn.addEventListener('click', function() {
      form.reset();
      orderForm.classList.add('hidden');
  });

  // توليد الكابشا
  generateCaptcha();
});