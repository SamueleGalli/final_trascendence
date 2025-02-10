def set_routes(server)
    public_dir = File.expand_path("../../public", __FILE__)
    game_engine_dir = File.join(public_dir, "game_engine")
    server.mount "/game_engine/css", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "css")
    server.mount "/game_engine/js", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "js")
    server.mount "/game_engine/images", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "images")
    #server.mount "/game_engine/js/login", WEBrick::HTTPServlet::FileHandler, File.join(game_engine_dir, "login")
    server.mount "/favicon.ico", WEBrick::HTTPServlet::FileHandler, File.join(public_dir, "favicon.ico")
    #server.mount "/game_engine/js/pages", WEBrick::HTTPServlet::FileHandler, File.join(public_dir, "pages")
    #server.mount "/game_engine/game", WEBrick::HTTPServlet::FileHandler, File.join(public_dir, "pages")

end