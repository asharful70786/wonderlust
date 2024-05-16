const User = require("../models/user.js");

module.exports.renderLoginForm = (req, res) => {
  res.render("./user/login.ejs");
};

module.exports.renderSingup = (req, res) => {
  res.render("./user/singup.ejs");
};

module.exports.singup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email }); // Create a new user object
    const registeredUser = await User.register(newUser, password); // Register the user
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        next(err); // Pass error to Express.js error handling middleware
      } else {
        req.flash("success", "Registration successful!");
        res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/singup");
  }
};



module.exports.login=((req, res) => {
  req.flash("success", "Welcome to wonderlust!");
  let redirectUrl = req.session.redirectUrl || "/listings";
  res.redirect(redirectUrl);
});

module.exports.logout = (req, res) => {
  req.logout((err) => {
    console.log(err);
  }); // Log out the user
  req.flash("success", "You have been successfully logged out.");
  res.redirect("/listings");
};
