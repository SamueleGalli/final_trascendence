class SessionManager
    def store_access_token(request, token)
      request.session[:access_token] = token.token
    end

    def clear(request)
      request.session.clear
    end
  end