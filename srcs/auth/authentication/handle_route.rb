def set_routes(server)
    public_dir = File.expand_path("../../public", __FILE__)
    server.mount "/favicon.ico", WEBrick::HTTPServlet::FileHandler, File.join(public_dir, "favicon.ico")
    Dir.glob("#{public_dir}/**/*").each do |path|
        next if File.directory?(path)
        mount_point = "/#{path.sub(public_dir, '').sub(/^\/+/, '')}"
        server.mount mount_point, WEBrick::HTTPServlet::FileHandler, path
    end

    server.mount_proc '/*' do |req, res|
        file_path = File.join(public_dir, req.path)
    
        if File.file?(file_path)
            res.body = File.read(file_path)
        else
            res['Content-Type'] = 'text/html'
            res.body = File.read(File.join(public_dir, 'index.html'))
        end
    end
    
end
