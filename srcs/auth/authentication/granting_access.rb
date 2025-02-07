def access_granted?(request)
    request.session[:access_granted] == true
end  

def get_access_granted(session_id)
    session_data = read_session_data(session_id)
    session_data && session_data["access_granted"]
end

def spa_route?(path)
    spa_routes = [
        '/modes', '/friends', '/stats', '/profile', '/classic', '/V.S._AI',
        '/tournament', '/forza4', '/forza4/game', '/forza4/userstats',
        '/settings', '/settings/customizepong',
        '/settings/customizeforza4', '/tournament/knockout',
        '/tournament/roundrobin', '/tournament/roundrobin/robinranking',
        '/tournament/roundrobin/robinranking/game', '/tournament/userstats',
        '/tournament/userstats/matchdetails', '/tournament/knockout/bracket',
        '/tournament/knockout/bracket/game'
    ]
    File.extname(path).empty? && spa_routes.include?(path)
end