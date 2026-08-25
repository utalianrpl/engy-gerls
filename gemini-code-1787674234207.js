// ================= DATA NAMA SISWA & EVENT =================
const daftarSiswa = [
    "Andi", "Budi", "Citra", "Dinda", "Eko", 
    "Fajar", "Gita", "Hana", "Indra", "Joko"
];

const daftarEvent = [
    "Beli konsumsi", "Acara kelas", "Study tour", 
    "Dekorasi kelas", "Fotokopi", "Lainnya"
];

// FUNGSI GANTI DROPDOWN DINAMIS
function updateDropdownKeterangan() {
    const jenisSelect = document.getElementById("jenisTransaksi");
    const selectKet = document.getElementById("namaSiswa");
    
    if (!jenisSelect || !selectKet) return;

    const jenis = jenisSelect.value;
    selectKet.innerHTML = "";

    const listData = (jenis === "masuk") ? daftarSiswa : daftarEvent;

    listData.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.innerText = item;
        selectKet.appendChild(opt);
    });
}

// ================= SISTEM LOGIN & NAVIGASI =================

function cekStatusLogin() {
    const sudahLogin = localStorage.getItem("classLedgerLoggedIn");
    const currentUser = localStorage.getItem("classLedgerCurrentUser");

    if (sudahLogin === "true") {
        tampilkanDashboard(currentUser);
    } else {
        tampilkanLogin();
    }
}

function tampilkanDashboard(user) {
    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");

    if (loginPage) loginPage.style.display = "none";
    if (dashboardPage) dashboardPage.style.display = "flex";

    const userDisplay = document.getElementById("currentUserDisplay");
    if (userDisplay && user) {
        userDisplay.innerText = "Login sebagai: " + user;
    }

    updateDropdownKeterangan();
    prosesHitungDanMuatUlang();
}

function tampilkanLogin() {
    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");

    if (loginPage) loginPage.style.display = "flex";
    if (dashboardPage) dashboardPage.style.display = "none";
}

function login() {
    const userEl = document.getElementById("username");
    const passEl = document.getElementById("password");
    const message = document.getElementById("message");

    if (!userEl || !passEl) return;

    const user = userEl.value.trim();
    const pass = passEl.value;

    let accounts = JSON.parse(localStorage.getItem("classLedgerAccounts")) || [];
    let loginValid = (user === "admin" && pass === "12345");

    if (!loginValid) {
        loginValid = accounts.some(akun => akun.username === user && akun.password === pass);
    }

    if (loginValid) {
        if (message) {
            message.style.color = "#7CFF8D";
            message.innerHTML = "✔ Login Successful!";
        }

        localStorage.setItem("classLedgerLoggedIn", "true");
        localStorage.setItem("classLedgerCurrentUser", user);

        setTimeout(() => {
            tampilkanDashboard(user);
        }, 500);
    } else {
        if (message) {
            message.style.color = "#FFD4D4";
            message.innerHTML = "✖ Invalid Username or Password";
        }
    }
}

function logout() {
    if (confirm("Apakah Anda yakin ingin logout?")) {
        localStorage.removeItem("classLedgerLoggedIn");
        localStorage.removeItem("classLedgerCurrentUser");
        tampilkanLogin();

        const userEl = document.getElementById("username");
        const passEl = document.getElementById("password");
        const message = document.getElementById("message");

        if (userEl) userEl.value = "";
        if (passEl) passEl.value = "";
        if (message) message.innerHTML = "";
    }
}

// ================= REGISTER & RESET PASSWORD =================

function bukaDaftar() {
    const modal = document.getElementById("signupModal");
    const msg = document.getElementById("signupMessage");
    if (modal) modal.style.display = "flex";
    if (msg) msg.innerHTML = "";
}

function tutupDaftar() {
    const modal = document.getElementById("signupModal");
    if (modal) modal.style.display = "none";
}

function buatAkun() {
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;
    const message = document.getElementById("signupMessage");

    if (username === "" || password === "" || confirmPassword === "") {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Semua kolom harus diisi.";
        return;
    }

    if (password !== confirmPassword) {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Konfirmasi password tidak cocok.";
        return;
    }

    let accounts = JSON.parse(localStorage.getItem("classLedgerAccounts")) || [];
    const akunSudahAda = accounts.some(akun => akun.username.toLowerCase() === username.toLowerCase());

    if (akunSudahAda) {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Username sudah digunakan.";
        return;
    }

    accounts.push({ username: username, password: password });
    localStorage.setItem("classLedgerAccounts", JSON.stringify(accounts));

    message.style.color = "#7CFF8D";
    message.innerHTML = "✔ Akun berhasil dibuat! Silakan login.";

    setTimeout(() => {
        tutupDaftar();
        document.getElementById("username").value = username;
        document.getElementById("password").value = "";
    }, 1000);
}

function bukaLupaPassword() {
    const modal = document.getElementById("forgotPasswordModal");
    const msg = document.getElementById("forgotMessage");
    if (modal) modal.style.display = "flex";
    if (msg) msg.innerHTML = "";
}

function tutupLupaPassword() {
    const modal = document.getElementById("forgotPasswordModal");
    if (modal) modal.style.display = "none";
}

function resetPassword() {
    const username = document.getElementById("forgotUsername").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmNewPassword").value;
    const message = document.getElementById("forgotMessage");

    if (username === "" || newPassword === "" || confirmPassword === "") {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Semua kolom harus diisi.";
        return;
    }

    if (newPassword !== confirmPassword) {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Konfirmasi password tidak cocok.";
        return;
    }

    let accounts = JSON.parse(localStorage.getItem("classLedgerAccounts")) || [];
    const accountIndex = accounts.findIndex(akun => akun.username.toLowerCase() === username.toLowerCase());

    if (username.toLowerCase() === "admin") {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Password akun admin bawaan tidak dapat diubah.";
        return;
    }

    if (accountIndex === -1) {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Username tidak ditemukan.";
        return;
    }

    accounts[accountIndex].password = newPassword;
    localStorage.setItem("classLedgerAccounts", JSON.stringify(accounts));

    message.style.color = "#7CFF8D";
    message.innerHTML = "✔ Password berhasil diubah!";

    setTimeout(() => {
        tutupLupaPassword();
        document.getElementById("username").value = username;
        document.getElementById("password").value = "";
    }, 1000);
}

// ================= LOGIKA KAS KELAS =================

function catatTransaksiBaru() {
    const namaSelect = document.getElementById("namaSiswa");
    const jenisSelect = document.getElementById("jenisTransaksi");
    const nominalInput = document.getElementById("nominalUang");

    if (!namaSelect || !jenisSelect || !nominalInput) return;

    const nama = namaSelect.value;
    const jenis = jenisSelect.value;
    const nominal = parseInt(nominalInput.value);

    if (!nama || isNaN(nominal) || nominal <= 0) {
        alert("Harap pilih keterangan dan masukkan nominal uang yang valid!");
        return;
    }

    const dataTransaksi = {
        id: Date.now(),
        keterangan: nama,
        tipe: jenis,
        jumlah: nominal
    };

    let databaseKas = JSON.parse(localStorage.getItem("classLedgerDB")) || [];
    databaseKas.push(dataTransaksi);
    localStorage.setItem("classLedgerDB", JSON.stringify(databaseKas));

    nominalInput.value = "";
    prosesHitungDanMuatUlang();
}

function prosesHitungDanMuatUlang() {
    const tbody = document.getElementById("tabelTransaksiBody");
    const saldoDisplay = document.getElementById("totalSaldoDisplay");
    
    if (!tbody) return;

    tbody.innerHTML = "";
    let databaseKas = JSON.parse(localStorage.getItem("classLedgerDB")) || [];
    let akumulasiSaldo = 0;

    if (databaseKas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#64748b;">Belum ada riwayat transaksi kas kelas.</td></tr>`;
        if (saldoDisplay) saldoDisplay.innerText = "Rp 0";
        return;
    }

    databaseKas.forEach(item => {
        const baris = document.createElement("tr");

        let simbolTipe = "";
        let classWarna = "";
        if (item.tipe === "masuk") {
            akumulasiSaldo += item.jumlah;
            simbolTipe = "Masuk";
            classWarna = "masuk";
        } else {
            akumulasiSaldo -= item.jumlah;
            simbolTipe = "Keluar";
            classWarna = "keluar";
        }

        baris.innerHTML = `
            <td><strong>${item.keterangan}</strong></td>
            <td class="${classWarna}">${simbolTipe}</td>
            <td class="${classWarna}">Rp ${item.jumlah.toLocaleString('id-ID')}</td>
            <td><span class="btn-hapus" onclick="hapusTransaksi(${item.id})">Hapus</span></td>
        `;
        tbody.appendChild(baris);
    });

    if (saldoDisplay) {
        saldoDisplay.innerText = "Rp " + akumulasiSaldo.toLocaleString('id-ID');
    }
}

function hapusTransaksi(idTarget) {
    if (confirm("Apakah Anda yakin ingin menghapus rekor catatan kas ini?")) {
        let databaseKas = JSON.parse(localStorage.getItem("classLedgerDB")) || [];
        databaseKas = databaseKas.filter(item => item.id !== idTarget);
        localStorage.setItem("classLedgerDB", JSON.stringify(databaseKas));
        prosesHitungDanMuatUlang();
    }
}

// Menjalankan pengecekan setelah DOM aman & selesai dimuat
document.addEventListener("DOMContentLoaded", function() {
    cekStatusLogin();
});