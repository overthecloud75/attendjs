* to do list 
    - client : Link Acitve when onclick
    - client : react-table left-right scroll 
    - backend : email server

    - planning : weekly reporting system 
    - planning : 결재 

22/12/12
    - 1.1.1 (client)
        remove <React.StrictMode> in index.js 
        version.txt -> CHANGELOG.md

22/12/11
    - fix issue
        issue : data를 update 한 후 화면 표시는 react에 의해 바로 udpate 되지만 refresh를 
                할 경우 이전 data가 보임. refresh를 여러번 하는 경우 예상되는 data가 반영
        원인 : IIS 출력 캐시가 30s로 설정 되어 있음
    - 1.1.0 (client, api)
        client : when error, add or delete event is not updated in calendar.jsx 
        api : fix the situation when '/ is not included' in add_event in event.js
    - 1.0.9 (api)
        fix log format in winston.js

22/12/10
    - 1.0.8 (client, api)
        client : axios.defaults.headers.post['X-CSRF-Token'] = res.headers.csrftoken, 
        api : setHeader('csrftoken', req.csrfToken())
     
        
