var express = require('express');
var pool = require('./pool');
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
var router = express.Router();

router.get('/loginpage', function (req, res) {
    res.render('loginpage', { msg: "" })
  })
  
  router.post('/checkidpass', function (req, res) {
  
    pool.query('select * from admindata where adminemail=? and adminpassword=?',[req.body.email,req.body.password], function (error, result) {
      console.log(result)
  
      if (error) {
        console.log("error aa rahi hai ismai", error)
        res.render("loginpage",{msg:"SERVER ERROR....."})
      }
  
      else {
        if(result.length==1){
          localStorage.setItem('admin',JSON.stringify({email:result[0].adminemail,name:result[0].adminname}))
          res.render("dashboard",{result:result[0]})
        }
        else{
          res.render("loginpage",{msg:"Invalid UserId/Password"})
        }
      }
    })
  })
  
  router.get('/logout',function(req,res){
    localStorage.clear()
    res.render("loginpage",{msg:""})
  })

  
  module.exports = router;