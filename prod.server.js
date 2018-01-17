var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var app = express()

var apiRoutes = express.Router()

apiRoutes.get('/getDiscList', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  // 发送http请求，配置headers和params
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/playlist.html',
      host: 'y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(err => {
    console.log(err)
  })
})

apiRoutes.get('/lyric', function (req, res) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  // 发送http请求，配置headers和params
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/player.html',
      host: 'y.qq.com'
    },
    params: req.query
  }).then(response => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch(err => {
    console.log(err)
  })
})

apiRoutes.get('/getCdInfo', function (req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  // 发送http请求，配置headers和params
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({.+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch(err => {
    console.log(err)
  })
})

apiRoutes.get('/getRankInfo', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  // 发送http请求，配置headers和params
  axios.get(url, {
    headers: {
      referer: 'https://m.y.qq.com/',
      host: 'm.y.qq.com'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(err => {
    console.log(err)
  })
})

apiRoutes.get('/getRankDetailInfo', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  // 发送http请求，配置headers和params
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/w/toplist.html'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(err => {
    console.log(err)
  })
})

apiRoutes.get('/gethotkey', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  // 发送http请求，配置headers和params
  axios.get(url, {
    headers: {
      referer: 'https://m.y.qq.com/'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(err => {
    console.log(err)
  })
})

apiRoutes.get('/getSearch', function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  // 发送http请求，配置headers和params
  axios.get(url, {
    headers: {
      referer: 'https://m.y.qq.com/'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(err => {
    console.log(err)
  })
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at Http://localhost:' + port + '\n')
})
