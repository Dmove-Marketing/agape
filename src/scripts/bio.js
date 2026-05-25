/* Scripts extraídos de bio.html */

// Phone mask
    const whatsappInput = document.getElementById('whatsapp');
    whatsappInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').substring(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d+)$/, '($1) $2');
      }
      this.value = v;
    });
