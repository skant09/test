function checkPassword(str) {
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  return re.test(str);
}

function checkForm(form, account) {

  if (account.userName.value == "") {
    alert("Error: Username cannot be blank!");
    form.userName.focus();
    return false;
  }

  if (account.telephone.value == "") {
    alert("Error: telephone cannot be blank!");
    form.telephone.focus();
    return false;
  }

  var phoneReg = /^\d{10}$/; 
  if (!phoneReg.test(account.telephone.value)) {
    alert("Error: Telephone number should contain only 10 numerics.");
    form.telephone.focus();
    return false;
  }

  if (account.pwd1.value != "" && account.pwd1.value == account.pwd2.value) {
    if (!checkPassword(account.pwd1.value)) {
      alert("The password you have entered is not valid. It should contain one numerics, one small letter and one capital letter");
      account.pwd1.focus();
      return false;
    }
  } else {
    alert("Error: Please check that you've entered and confirmed your password!");
    account.pwd1.focus();
    return false;
  }

  var user = {
    email:account.userName.value,
    telephone: account.telephone.value,
    password : account.pwd1.value,
    date: account.date.value
  }
  
  if(localStorage.getItem("users") === null){
    localStorage.setItem("users", JSON.stringify([user]));
  } else{
    var users = JSON.parse(localStorage.getItem("users"));
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  }
  refreshData();
  return true;
}