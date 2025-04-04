function showSlide(index) {
  const swiper = document.getElementById('swiper');
  const slides = swiper.getElementsByClassName('swiper-slide');
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = i === index ? 'block' : 'none';
  }
}

function toggleForm(formId) {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById(formId).style.display = 'block';
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  fetch("http://127.0.0.1:8000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      alert("Login successful");
      fetchDashboardData();
    } else {
      alert("Login failed: " + (data.detail || "Unknown error"));
    }
  })
  .catch(err => console.error("Login error:", err));
}

function register() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  fetch("http://127.0.0.1:8000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
  .then(res => res.json())
  .then(data => {
    alert("Registration successful, now login.");
    toggleForm('loginForm');
  })
  .catch(err => console.error("Register error:", err));
}

function logout() {
  localStorage.removeItem("token");
  alert("Logged out");
  showSlide(0);
  document.getElementById("totalBalance").innerHTML = "€ 0.00";
  document.getElementById("transactionList").innerHTML = "";
}

function fetchDashboardData() {
  const token = localStorage.getItem("token");
  if (!token) return;

  // Fetch total account balance
  fetch("http://127.0.0.1:8000/accounts/1", {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    const total = data.reduce((acc, a) => acc + a.balance, 0);
    document.getElementById("totalBalance").innerHTML = "€ " + total.toFixed(2);
  })
  .catch(err => console.error("Balance fetch error:", err));

  // Fetch recent transactions
  fetch("http://127.0.0.1:8000/transactions/1", {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("transactionList");
    list.innerHTML = "";
    data.slice(0, 5).forEach(tx => {
      const item = document.createElement("li");
      const sign = tx.type === 'credit' ? '+' : '-';
      item.textContent = `${sign} €${tx.amount} - ${tx.description}`;
      list.appendChild(item);
    });
  })
  .catch(err => console.error("Transaction fetch error:", err));
}
// Transfers (transferAmount, transferTo, transferDescription)
function makeTransfer() {
  const token = localStorage.getItem("token");
  const amount = document.getElementById("transferAmount").value;
  const to = document.getElementById("transferTo").value;
  const description = document.getElementById("transferDescription").value;

  fetch("http://127.0.0.1:8000/transactions/transfer", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ to_account_id: to, amount: amount, description: description })
  })
  .then(res => res.json())
  .then(data => {
    alert("Transfer successful!");
    fetchDashboardData(); // Refresh balance and transactions
  })
  .catch(err => alert("Transfer failed: " + err));
}

//Bank registration (bankName, initialBalance)
function registerBankAccount() {
  const token = localStorage.getItem("token");
  const bankName = document.getElementById("bankName").value;
  const initialBalance = document.getElementById("initialBalance").value;

  fetch("http://127.0.0.1:8000/accounts", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ bank_name: bankName, balance: initialBalance })
  })
  .then(res => res.json())
  .then(data => {
    alert("Bank account registered.");
    fetchDashboardData();
  })
  .catch(err => alert("Bank registration failed: " + err));
}

// Full transaction list (transactionHistoryList)
function fetchAllTransactions() {
  const token = localStorage.getItem("token");
  fetch("http://127.0.0.1:8000/transactions/1", {
    headers: { "Authorization": "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("transactionHistoryList");
    list.innerHTML = "";
    data.forEach(tx => {
      const item = document.createElement("li");
      const sign = tx.type === 'credit' ? '+' : '-';
      item.textContent = `${sign} €${tx.amount} - ${tx.description}`;
      list.appendChild(item);
    });
  })
  .catch(err => console.error("History fetch error:", err));
}

window.onload = function() {
  showSlide(0); // Default to first slide
  fetchDashboardData(); // Try to load data if token exists
};
