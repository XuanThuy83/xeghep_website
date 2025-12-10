function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // ========== FORM ĐẶT XE ==========
  const bookingForm = document.getElementById("bookingForm");
  const contactForm = document.getElementById("contactForm");
  const dateInput = document.querySelector('input[name="date"]');
  const timeSlotSelect = document.querySelector('select[name="time_slot"]');

  // Khóa ngày đã trôi qua
  if (dateInput) {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    dateInput.min =
      today.getFullYear() +
      "-" +
      pad(today.getMonth() + 1) +
      "-" +
      pad(today.getDate());
  }

  // ====== BẢNG GIÁ & FILTER ĐIỂM ĐI/ĐẾN ======
  const fromSelect = document.querySelector('select[name="from"]');
  const toSelect = document.querySelector('select[name="to"]');
  const priceValue = document.querySelector(".price-value");

  
  const PRICE_MAP = {
    "HN-HN": "150.000 – 250.000đ/chuyến (nội thành Hà Nội)",
    "HP-HP": "120.000 – 200.000đ/chuyến (nội thành Hải Phòng)",

    // Hà Nội ⇌ Hải Phòng
    "HN-HP": "350.000 – 400.000đ/chuyến",
    "HP-HN": "350.000 – 400.000đ/chuyến",

    // Hà Nội ⇌ Quảng Ninh
    "HN-QN": "450.000 – 600.000đ/chuyến",
    "QN-HN": "450.000 – 600.000đ/chuyến",

    // Hải Phòng ⇌ Quảng Ninh
    "HP-QN": "450.000 – 600.000đ/chuyến",
    "QN-HP": "450.000 – 600.000đ/chuyến",

    // Sân bay Nội Bài → Hà Nội / Hải Phòng / Quảng Ninh
    "NB-HN": "300.000 – 350.000đ/chuyến",
    "NB-HP": "900.000đ/chuyến",
    "NB-QN": "1.200.000đ/chuyến",
  };


  
  function getCity(code) {
    if (!code) return null;
    if (code.startsWith("HN-")) return "HN";
    if (code.startsWith("HP-")) return "HP";
    if (code.startsWith("QN-")) return "QN";
    if (code.startsWith("NB-")) return "NB";
    return null;
  }


  function resetOptions(select) {
    Array.from(select.options).forEach(function (opt) {
      opt.hidden = false;
    });
  }

  function filterSelect(sourceSelect, targetSelect) {
    const val = sourceSelect.value;
    resetOptions(targetSelect);
    if (!val) return;

    const city = getCity(val);
    if (!city) return;

    Array.from(targetSelect.options).forEach(function (opt) {
      if (!opt.value) return;
      const optCity = getCity(opt.value);
      if (!optCity) return;
      if (optCity === city) {
        opt.hidden = true;
      }
    });

    if (targetSelect.value) {
      const targetCity = getCity(targetSelect.value);
      if (targetCity === city) {
        targetSelect.value = "";
      }
    }
  }

  function updatePrice() {
    if (!priceValue || !fromSelect || !toSelect) return;

    const serviceInput = document.querySelector('input[name="service"]:checked');
    const service = serviceInput ? serviceInput.value : "xe-ghep";

    if (service === "bao-xe") {
      priceValue.textContent = "900.000đ/bao xe";
      return;
    }

    if (service === "gui-do") {
      priceValue.textContent = "Gửi đồ: giá theo thị trường – gọi hotline.";
      return;
    }

    const fromCity = getCity(fromSelect.value);
    const toCity = getCity(toSelect.value);

    if (!fromCity || !toCity) {
      priceValue.textContent = "Đang cập nhật...";
      return;
    }

    const key = fromCity + "-" + toCity;
    if (PRICE_MAP[key]) {
      priceValue.textContent = PRICE_MAP[key];
    } else {
      priceValue.textContent = "Liên hệ để được báo giá chính xác.";
    }
  }

  const serviceRadios = document.querySelectorAll('input[name="service"]');
  if (serviceRadios.length) {
    serviceRadios.forEach(function (radio) {
      radio.addEventListener("change", updatePrice);
    });
  }

  if (fromSelect && toSelect) {
    fromSelect.addEventListener("change", function () {
      filterSelect(fromSelect, toSelect);
      updatePrice();
    });

    toSelect.addEventListener("change", function () {
      filterSelect(toSelect, fromSelect);
      updatePrice();
    });
  }

  
  // ====== TAB SÂN BAY: SÂN BAY NỘI BÀI → HÀ NỘI / HẢI PHÒNG / QUẢNG NINH ======
  const tabs = document.querySelectorAll(".booking-tab");

  // danh sách quận/huyện để render option nhanh
  const DISTRICTS = {
    HN: [
      "Ba Đình","Hoàn Kiếm","Hai Bà Trưng","Đống Đa","Tây Hồ","Cầu Giấy","Thanh Xuân",
      "Hoàng Mai","Long Biên","Hà Đông","Bắc Từ Liêm","Nam Từ Liêm","Sóc Sơn","Đông Anh",
      "Gia Lâm","Thanh Trì","Hoài Đức","Quốc Oai","Thanh Oai","Thường Tín","Phú Xuyên",
      "Chương Mỹ","Ứng Hòa","Mỹ Đức","Ba Vì","Phúc Thọ","Thạch Thất","Đan Phượng","Mê Linh"
    ],
    HP: [
      "Hồng Bàng","Ngô Quyền","Lê Chân","Hải An","Kiến An","Đồ Sơn","Dương Kinh",
      "An Dương","An Lão","Kiến Thuỵ","Thủy Nguyên","Tiên Lãng","Vĩnh Bảo","Cát Hải","Bạch Long Vĩ"
    ],
    QN: [
      "Hạ Long","Cẩm Phả","Móng Cái","Uông Bí","Đông Triều","Quảng Yên","Vân Đồn","Cô Tô",
      "Hải Hà","Đầm Hà","Tiên Yên","Bình Liêu","Ba Chẽ","Hoành Bồ"
    ]
  };

  function renderDistrictOptions(cityCode) {
    return DISTRICTS[cityCode]
      .map(function (name) {
        const value = cityCode + "-" + name.replace(/\s+/g, "");
        return '<option value="' + value + '">' + name + "</option>";
      })
      .join("");
  }

  function switchToAirportMode() {
    if (!fromSelect || !toSelect) return;

    // Điểm đi cố định: Sân bay Nội Bài
    fromSelect.innerHTML =
      '<option value="NB-NoiBai">Sân bay Nội Bài (HAN)</option>';
    fromSelect.value = "NB-NoiBai";
    fromSelect.disabled = true;

    // Điểm đến: Hà Nội + Hải Phòng + Quảng Ninh
    let html = "";
    html += '<optgroup label="Hà Nội">' + renderDistrictOptions("HN") + "</optgroup>";
    html += '<optgroup label="Hải Phòng">' + renderDistrictOptions("HP") + "</optgroup>";
    html += '<optgroup label="Quảng Ninh">' + renderDistrictOptions("QN") + "</optgroup>";
    toSelect.innerHTML = '<option value="">Chọn điểm đến</option>' + html;
    toSelect.value = "";
    toSelect.disabled = false;

    updatePrice();
  }

  function switchToNormalMode() {
    if (!fromSelect || !toSelect) return;
    // reload lại trang để dùng danh sách gốc trong HTML
    window.location.reload();
  }

  if (tabs && tabs.length > 0) {
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        const type = tab.dataset.type;

        if (type === "san-bay") {
          switchToAirportMode();
        } else {
          switchToNormalMode();
        }
      });
    });
  }

// ====== NÚT "Xem trên bản đồ" → Google Maps ======
  const mapBtn = document.querySelector(".price-map-btn");
  if (mapBtn && fromSelect && toSelect) {
    mapBtn.addEventListener("click", function () {
      if (!fromSelect.value || !toSelect.value) {
        alert(
          "Vui lòng chọn đầy đủ điểm đi và điểm đến trước khi xem trên bản đồ."
        );
        return;
      }

      const fromCity = getCity(fromSelect.value);
      const toCity = getCity(toSelect.value);
      if (!fromCity || !toCity) {
        alert("Không xác định được khu vực, vui lòng chọn lại.");
        return;
      }

      const fromOption = fromSelect.options[fromSelect.selectedIndex];
      const toOption = toSelect.options[toSelect.selectedIndex];

      const fromName = fromOption ? fromOption.text.trim() : "";
      const toName = toOption ? toOption.text.trim() : "";

      function cityLabel(code) {
        if (code === "HN") return "Hà Nội";
        if (code === "HP") return "Hải Phòng";
        if (code === "QN") return "Quảng Ninh";
        return "";
      }

      const originFull = fromName + ", " + cityLabel(fromCity);
      const destFull = toName + ", " + cityLabel(toCity);

      const url =
        "https://www.google.com/maps/dir/?api=1" +
        "&origin=" +
        encodeURIComponent(originFull) +
        "&destination=" +
        encodeURIComponent(destFull);

      window.open(url, "_blank");
    });
  }

  // ====== HÀM CHECK MOBILE ======
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  // ====== NÚT "ĐẶT XE NGAY" CŨ (trên header & cột cam kết) ======
  const callButtons = document.querySelectorAll(".btn-call");
  if (callButtons.length > 0) {
    callButtons.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        if (isMobile()) {
          window.location.href = "tel:0945983789";
        } else {
          alert(
            "Vui lòng gọi hotline: 0945 983 789 (qua điện thoại hoặc Zalo)."
          );
        }
      });
    });
  }

  // ====== FLOATING CONTACT WIDGET ======
  const contactWidget = document.querySelector(".contact-widget");
  const contactToggle = document.querySelector(".contact-toggle");

  if (contactWidget && contactToggle) {
    contactToggle.addEventListener("click", function (e) {
      e.preventDefault();
      contactWidget.classList.toggle("open");
    });
  }

  // Gọi điện
  const btnCallFloating = document.querySelector(".contact-item-call");
  if (btnCallFloating) {
    btnCallFloating.addEventListener("click", function (e) {
      e.preventDefault();
      if (isMobile()) {
        window.location.href = "tel:0945983789";
      } else {
        alert(
          "Vui lòng gọi hotline: 0945 983 789 (qua điện thoại hoặc Zalo)."
        );
      }
    });
  }

  // SMS
  const btnSms = document.querySelector(".contact-item-sms");
  if (btnSms) {
    btnSms.addEventListener("click", function (e) {
      e.preventDefault();
      if (isMobile()) {
        window.location.href = "sms:0945983789";
      } else {
        alert(
          "Soạn SMS gửi 0945 983 789 với nội dung đặt xe của bạn trên điện thoại."
        );
      }
    });
  }

  // Zalo
  const btnZalo = document.querySelector(".contact-item-zalo");
  if (btnZalo) {
    btnZalo.addEventListener("click", function (e) {
      e.preventDefault();
      // Đổi lại link Zalo của bạn nếu cần
      window.open("https://zalo.me/0945983789", "_blank");
    });
  }

  // Messenger
  const btnMessenger = document.querySelector(".contact-item-messenger");
  if (btnMessenger) {
    btnMessenger.addEventListener("click", function (e) {
      e.preventDefault();
      // Đổi "ten_fanpage_cua_ban" thành ID/page của bạn
      window.open("https://m.me/ten_fanpage_cua_ban", "_blank");
    });
  }

  // ====================== SLIDER GIỚI THIỆU TRANG CHỦ ======================
  const sliderWrap = document.querySelector(".home-slider-wrap");
  const sliderTrack = document.getElementById("homeSlider");
  const sliderSlides = sliderTrack ? sliderTrack.querySelectorAll(".home-slide") : [];
  const btnPrev = document.querySelector(".home-slider-prev");
  const btnNext = document.querySelector(".home-slider-next");

  if (sliderWrap && sliderTrack && sliderSlides.length > 0) {
    let currentIndex = 0;
    const total = sliderSlides.length;

    function showSlide(index) {
      const offset = index * 100;
     sliderTrack.style.transform = `translateX(-${offset}%)`;
  document.documentElement.style.setProperty("--slide-index", currentIndex);
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % total;
      showSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + total) % total;
      showSlide(currentIndex);
    }

    let autoTimer = setInterval(nextSlide, 4000);

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(nextSlide, 4000);
    }

    if (btnNext) {
      btnNext.addEventListener("click", function () {
        nextSlide();
        resetAuto();
      });
    }
    if (btnPrev) {
      btnPrev.addEventListener("click", function () {
        prevSlide();
        resetAuto();
      });
    }

    // Vuốt trên mobile
    let startX = 0;
    sliderWrap.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
    });

    sliderWrap.addEventListener("touchend", function (e) {
      const endX = e.changedTouches[0].clientX;
      const delta = endX - startX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetAuto();
      }
    });
  }

});
