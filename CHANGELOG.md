* to do list 
    - client : Link Acitve when onclick <br>
    - client : react-table left-right scroll <br>
    - backend : email server <br>
      <br>
    - planning : weekly reporting system <br>
    - planning : 결재 <br>

* 22/01/20
    - 1.2.5 (client) <br>
        setLoading in Auth.jsx <br>

* 22/01/19
    - 1.2.4 (client, api) <br>
        apply gps attend <br>

* 22/01/17
    - 1.2.3 (client) <br>
        check-email page to activate account <br>

* 22/01/16
    - 1.2.2 (client, api) <br>
        location <br>

* 22/01/15
    - 1.2.1 (client) <br>
        use google map api <br>
    - 1.2.0 (client) <br>
        apply media-query in styled-components for mobile <br> 
    - 1.1.9 (client, api) <br>
        post geoLocation when login <br>

* 22/01/14
    - 1.1.8 (api) <br>
        save login record in database <br>
    - 1.1.7 (client) <br>
        remove sidebar in login, register page <br>

* 22/12/28
    - 1.1.6 (api) <br>
        router.delete -> router.post because of WAF prevention <br>

* 22/12/24
    - 1.1.5 (api) <br>
        checkExternalIP for verifyIP<br>

    - 1.1.4 (api) <br>
        employee name and user name have to be the same <br>
        post only necessary field in register in auth.js <br>

* 22/12/21
    - 1.1.3 (api) <br>
        only employee can make id in auth.js<br>

* 22/12/17
    - 1.1.2 (api) <br>
        fix verifyIP logic <br>

* 22/12/12
    - 1.1.1 (client) <br>
        remove <React.StrictMode> in index.js <br>
        version.txt -> CHANGELOG.md <br>

* 22/12/11
    - fix issue <br>
        issue : data를 update 한 후 화면 표시는 react에 의해 바로 udpate 되지만 refresh를 
                할 경우 이전 data가 보임. refresh를 여러번 하는 경우 예상되는 data가 반영 <br>
        원인 : IIS 출력 캐시가 30s로 설정 되어 있음 <br>
    - 1.1.0 (client, api) <br>
        client : when error, add or delete event is not updated in calendar.jsx <br>
        api : fix the situation when '/ is not included' in add_event in event.js <br>
    - 1.0.9 (api) <br>
        fix log format in winston.js <br>

* 22/12/10
    - 1.0.8 (client, api) <br>
        client : axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken <br>
        api : setHeader('csrftoken', req.csrfToken()) <br>
     
        
