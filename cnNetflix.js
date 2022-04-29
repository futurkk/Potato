//let params = getParams($argument)
const BASE_URL = 'https://www.netflix.com/title/'

const FILM_ID = 81215567
const AREA_TEST_FILM_ID = 80018499

;(async () => {
  let result = {
    title: "让我瞧瞧你的Netflix可不可以看！",
    icon: "wifi.slash",
	  'icon-color':"#000000",
    content: '你快給我刷新一下的喔！',
  }
  await test(FILM_ID)
    .then((code) => {
      if (code === 'Not Found') {
        return test(AREA_TEST_FILM_ID)
      }
      result['Title'] = "让我瞧瞧你的Netflix可不可以看！"
      result['icon'] = "checkmark.seal.fill"
	    result['icon-color'] = '#3CB371'
      result['content'] = '你在' + code.toUpperCase() + '可以看全部的内容喔！'
      return Promise.reject('BreakSignal')
    })
    .then((code) => {
      if (code === 'Not Found') {
        return Promise.reject('Not Available')
      }
      result['Title'] = "让我瞧瞧你的Netflix可不可以看！"
      result['icon'] = "exclamationmark.triangle"
	    result['icon-color'] = "#FFD700"
      result['content'] = '你在' + code.toUpperCase() + '只能看一點點自制喔！ '
      return Promise.reject('BreakSignal')
    })
    .catch((error) => {
      if (error === 'Not Available') {
        result['Title'] = "让我瞧瞧你的Netflix可不可以看！"
        result['icon'] = "eye.slash"
	      result['icon-color'] = "#DC143C"
        result['content'] = '你现在这个地方一點點也不能看喔！'
        return
      }
    })
    .finally(() => {
      $done(result)
    })
})()

function test(filmId) {
  return new Promise((resolve, reject) => {
    let option = {
      url: BASE_URL + filmId,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36',
      },
    }
    $httpClient.get(option, function (error, response, data) {
      if (error != null) {
        reject('Error')
        return
      }

      if (response.status === 403) {
        reject('Not Available')
        return
      }

      if (response.status === 404) {
        resolve('Not Found')
        return
      }

      if (response.status === 200) {
        let url = response.headers['x-originating-url']
        let region = url.split('/')[3]
        region = region.split('-')[0]
        if (region == 'title') {
          region = 'us'
        }
        resolve(region)
        return
      }

      reject('Error')
    })
  })
}

function getParams(param) {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}
