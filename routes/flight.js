/** All of these are variable which hold the refrence */
var express = require('express');
var pool = require('./pool');
var router = express.Router();
var upload = require('./multer');
var fs=require('fs')
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch'); /** localstorage is an object */


/* GET home page. */
router.get('/addnewflights', function (req, res, next) {
  var result=JSON.parse(localStorage.getItem('admin'))
  console.log(result)
  if(result){
    res.render('addnewflightsinterface', { msg: '' });
  }
  else{
    res.render('loginpage', { msg: "" })
  }
});

/* Query after establishing connection pool with database */

router.get('/fetchallstates', function (req, res) {
  pool.query('select * from states', function (error, result) {
    if (error) {
      res.status(500).json([])
    }

    else {
      res.status(200).json(result)
    }
  })
})

router.get('/fetchallcity', function (req, res) {
  pool.query('select * from city where stateid=?', [req.query.stateid], function (error, result) {
    if (error) {
      res.status(500).json([])
    }

    else {
      res.status(200).json(result)
    }
  })
})

router.post('/addnewrecord', upload.single('logo'), function (req, res) {
  console.log("Body", req.body)
  console.log("file", req.file)

  var fclass
  if (Array.isArray(req.body.fclass))
    fclass = req.body.fclass.join('#')
  else
    fclass = req.body.fclass


  var days
  if (Array.isArray(req.body.days))
    var days = req.body.days.join('#')
  else
    days = req.body.days



  pool.query("insert into flights (flightid,companyname,sourcestateid,sourcecityid,destinationstateid,destinationcityid,status,flightclass,sourcetiming,destinationtiming,days,logo)values(?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.flightid, req.body.companyname, req.body.sourcestate, req.body.sourcecity, req.body.destinationstate, req.body.destinationcity, req.body.status, fclass, req.body.sourcetime, req.body.destime, days, req.file.originalname], function (error, result) {
    if (error) {
      console.log("Bhai Error Hai ismai", error)
      res.render('addnewflightsinterface', { msg: 'Server Error Record not Submitted' })
    }

    else {
      res.render('addnewflightsinterface', { msg: 'Record Submitted' })
    }
  })

})



router.get('/displayflightdata', function (req, res) {
  var result=JSON.parse(localStorage.getItem('admin'))
  if(!result){
  res.render('loginpage', { msg: "" })
  }
  else{
  pool.query('select F.*,(select C.cityname from city C where C.cityid=F.sourcecityid) as sourcecity,(select C.cityname from city C where C.cityid=F.destinationcityid) as destinationcity from flights F', function (error, result) {
    if (error) {
      res.render('displayall', { data: [] })
    }

    else {
      res.render('displayall', { data: result })
    }
  })
}
})


router.get('/updatebyid', function (req, res) {
  pool.query('select F.*,(select C.cityname from city C where C.cityid=F.sourcecityid) as sc,(select C.cityname from city C where C.cityid=F.destinationcityid) as dc,(select S.statename from states S where S.stateid=F.sourcestateid) as ss,(select S.statename from states S where S.stateid=F.destinationstateid) as ds from flights F where F.flightid=?', [req.query.fid], function (error, result) {
    console.log(result)
    if (error) {
      res.render('displaybyflightid', { data: [] })
    }

    else {
      res.render('displaybyflightid', { data: result[0] })
    }
  })
})


router.post('/editdeleterecord', function (req, res) {
  console.log("Body", req.body)
  if (req.body.btn == 'Edit') {

    var fclass
    if (Array.isArray(req.body.fclass))
      fclass = req.body.fclass.join('#')
    else
      fclass = req.body.fclass


    var days
    if (Array.isArray(req.body.days))
      var days = req.body.days.join('#')
    else
      days = req.body.days



    pool.query("update flights set companyname=?,sourcestateid=?,sourcecityid=?,destinationstateid=?,destinationcityid=?,status=?,flightclass=?,sourcetiming=?,destinationtiming=?,days=? where flightid=?", [req.body.companyname, req.body.sourcestate, req.body.sourcecity, req.body.destinationstate, req.body.destinationcity, req.body.status, fclass, req.body.sourcetime, req.body.destime, days, req.body.flightid], function (error, result) {
      if (error) {
        console.log("Bhai Error Hai ismai", error)
        res.redirect('/flight/displayflightdata')
      }

      else {
        res.redirect('/flight/displayflightdata')
      }
    })
  }
  else {
    pool.query('delete from flights where flightid=?', [req.body.flightid], function (error, result) {
      if (error) {
        console.log("Bhai Error Hai ismai", error)
        res.redirect('/flight/displayflightdata')
      }

      else {
        res.redirect('/flight/displayflightdata')
      }
    })

  }
})

router.get('/showpicture',function(req,res){
  res.render("showpicture",{flightid:req.query.fid,companyname:req.query.companyname,logo:req.query.logo})
})


router.post('/editpicture',upload.single('logo'),function(req,res){
  console.log(req.body)
  console.log(req.file)
  pool.query('update flights set logo=? where flightid=?',[req.file.originalname,req.body.flightid],function(error,result){
    console.log(result)
    if (error) {
      res.redirect('/flight/displayflightdata')
    }

    else {
      fs.unlinkSync('e:/VS CodeProjects/flightenquiry/public/images/'+req.body.oldlogo)
      res.redirect('/flight/displayflightdata')
    }

  })
})

router.get('/search', function (req, res) {
  res.render("searchfile")
})

router.get('/searchflights',function(req,res){
  pool.query("select F.*,(select C.cityname from city C where C.cityid=F.sourcecityid) as sc,(select C.cityname from city C where C.cityid=F.destinationcityid) as dc,(select S.statename from states S where S.stateid=F.sourcestateid) as ss,(select S.statename from states S where S.stateid=F.destinationstateid) as ds from flights F where F.sourcecityid=? and F.destinationcityid=?",[req.query.sid,req.query.did],function(error,result){
    if (error) {
      console.log(error)
      res.status(500).json([])
    }

    else {
      console.log(result)
      res.status(200).json(result)
    }
  })
})




module.exports = router;