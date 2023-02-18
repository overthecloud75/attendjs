* to do list 
    - client : Link Acitve when onclick <br>
    - client : react-table left-right scroll <br>
      <br>
    - planning : weekly reporting system <br>
    - planning : 결재 <br>
    - planning : 연차 관리 <br>

* 22/02/18
    - 1.4.9 (backend) <br>
        fix the attend issue between 23:30 and 24:00 <br>

* 22/02/15
    - 1.4.8 (client) <br>
        error fix : userAgentData is not operated in firefox <br>
        error fix : apply buttonClickd to avoid to login more than once <br>

* 22/02/12
    - 1.4.7 (client, api) <br>
        apply platform info <br>

* 22/02/11
    - 1.4.6 (client, api) <br>
        to detect fakelocation, getCurrentLocation twice <br>

    - 1.4.5 (client, api) <br>
        to detect if it is mobile, apply width and height <br>

* 22/02/06
    - 1.4.4 (client, api) <br>
        check mobile with user_agent<br>

* 22/02/05
    - 1.4.3 (client, api) <br>
        validateCheck for GPS data<br>

* 22/02/04
    - 1.4.2 (client) <br>
        apply lazy loading and jpg -> webp<br>

* 22/02/01
    - 1.4.1 (client, api) <br>
        apply remotePlace, checkMobile <br>
    - 1.4.0 (client, api, backend) <br>
        apply attendMode <br>

* 22/01/30
    - 1.3.9 (client, api) <br>
        apply crpyto.js to prevent abusing GPS info <br>

* 22/01/29
    - 1.3.8 (client) <br>
        apply the latest fullcalendar and ckeditor <br>
    - 1.3.7 (client) <br>
        control weekends, headerToolbar option in Calendar.jsx according to window size <br>
        
* 22/01/28
    - 1.3.6 (api) <br>
        check isMobile with ip info <br>
    - 1.3.5 (api) <br>
        fix verifyAdmin not working <br>
    - 1.3.4 (client) <br>
        sidebar disappear with clicking hambuger menu <br>

 * 22/01/27
    - 1.3.3 (api) <br>
        cors(domain) for security <br>
    - 1.3.2 (client, api) <br>
        loginHistory <br> 

 * 22/01/26
    - 1.3.1 (client) <br>
        Geolocation Error under login form <br> 

 * 22/01/24
    - 1.3.0 (client, api) <br>
        show current distance from the attend place <br> 
    - 1.2.9 (client, api, backend) <br>   
        insert 명절 in special holidays in WORKING <br>
 
* 22/01/23
    - 1.2.8 (backend) <br>
        _legacy_or_gps <br>
    - 1.2.7 (api) <br>
        remove err.stack when error for security <br>
    - 1.2.6 (client) <br>
        use /api in url to remove proxy between client and api <br>

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
        only employee can make id in auth.js <br>

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
     
        
