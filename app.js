// ================= DATA SISWA & EVENT =================
const daftarSiswa = [
    "Andi", "Budi", "Citra", "Dinda", "Eko", 
    "Fajar", "Gita", "Hana", "Indra", "Joko"
];

const daftarEvent = [
    "Beli konsumsi", "Acara kelas", "Study tour", 
    "Dekorasi kelas", "Fotokopi", "Lainnya"
];

// FUNGSI DROPDOWN DINAMIS (UANG MASUK -> NAMA SISWA, UANG KELUAR -> EVENT)
function updateDropdownKeterangan() {
    const jenis = document.getElementById("jenisTransaksi").value;
    const selectKet = document.getElementById("namaSiswa");
    selectKet.innerHTML = "";

    const listData = (jenis === "masuk") ? daftarSiswa : daftarEvent;

    listData.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.innerText = item;
        selectKet.appendChild(opt);
    });
}

// ================= LOGIN SYSTEM =================

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
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboardPage").style.display = "flex";

    const userDisplay = document.getElementById("currentUserDisplay");
    if (userDisplay && user) {
        userDisplay.innerText = "Login sebagai: " + user;
    }

    updateDropdownKeterangan();
    prosesHitungDanMuatUlang();
}

function tampilkanLogin() {
    document.getElementById("loginPage").style.display = "flex";
    document.getElementById("dashboardPage").style.display = "none";
}

function logout() {
    if (confirm("Apakah Anda yakin ingin logout?")) {
        localStorage.removeItem("classLedgerLoggedIn");
        localStorage.removeItem("classLedgerCurrentUser");
        tampilkanLogin();

        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("message").innerHTML = "";
    }
}

// ================= BUAT AKUN & RESET PASSWORD =================

function ambilAkun() {
    return JSON.parse(localStorage.getItem("classLedgerAccounts")) || [];
}

function bukaDaftar() {
    document.getElementById("signupModal").style.display = "flex";
    document.getElementById("signupMessage").innerHTML = "";
}

function tutupDaftar() {
    document.getElementById("signupModal").style.display = "none";
    document.getElementById("signupUsername").value = "";
    document.getElementById("signupPassword").value = "";
    document.getElementById("signupConfirmPassword").value = "";
    document.getElementById("signupMessage").innerHTML = "";
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

    let accounts = ambilAkun();
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

function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;
    const message = document.getElementById("message");

    let accounts = ambilAkun();
    let loginValid = (user === "admin" && pass === "12345");

    if (!loginValid) {
        loginValid = accounts.some(akun => akun.username === user && akun.password === pass);
    }

    if (loginValid) {
        message.style.color = "#7CFF8D";
        message.innerHTML = "✔ Login Successful!";

        localStorage.setItem("classLedgerLoggedIn", "true");
        localStorage.setItem("classLedgerCurrentUser", user);

        setTimeout(() => {
            tampilkanDashboard(user);
        }, 500);
    } else {
        message.style.color = "#FFD4D4";
        message.innerHTML = "✖ Invalid Username or Password";
    }
}

function bukaLupaPassword() {
    document.getElementById("forgotPasswordModal").style.display = "flex";
    document.getElementById("forgotMessage").innerHTML = "";
}

function tutupLupaPassword() {
    document.getElementById("forgotPasswordModal").style.display = "none";
    document.getElementById("forgotUsername").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmNewPassword").value = "";
    document.getElementById("forgotMessage").innerHTML = "";
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

    let accounts = ambilAkun();
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
        document.getElementById("message").style.color = "#7CFF8D";
        document.getElementById("message").innerHTML = "Silakan login dengan password baru.";
    }, 1000);
}

// ================= KAS KELAS LOGIC =================

function catatTransaksiBaru() {
    const nama = document.getElementById("namaSiswa").value;
    const jenis = document.getElementById("jenisTransaksi").value;
    const nominal = parseInt(document.getElementById("nominalUang").value);

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

    document.getElementById("nominalUang").value = "";
    prosesHitungDanMuatUlang();
}

function prosesHitungDanMuatUlang() {
    const tbody = document.getElementById("tabelTransaksiBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    let databaseKas = JSON.parse(localStorage.getItem("classLedgerDB")) || [];
    let akumulasiSaldo = 0;

    if (databaseKas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#64748b;">Belum ada riwayat transaksi kas kelas.</td></tr>`;
        document.getElementById("totalSaldoDisplay").innerText = "Rp 0";
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

    document.getElementById("totalSaldoDisplay").innerText = "Rp " + akumulasiSaldo.toLocaleString('id-ID');
}

function hapusTransaksi(idTarget) {
    if (confirm("Apakah Anda yakin ingin menghapus rekor catatan kas ini?")) {
        let databaseKas = JSON.parse(localStorage.getItem("classLedgerDB")) || [];
        databaseKas = databaseKas.filter(item => item.id !== idTarget);
        localStorage.setItem("classLedgerDB", JSON.stringify(databaseKas));
        prosesHitungDanMuatUlang();
    }
}

// Inisialisasi saat aplikasi pertama dibuka
document.addEventListener("DOMContentLoaded", function() {
    cekStatusLogin();
});