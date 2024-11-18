require 'sinatra'
require_relative 'config'  # Importa `CLIENT` dal file di configurazione

# Punto di ingresso per il login OAuth
get '/' do
  if session[:user_authenticated]
    redirect 'http://localhost:8000/ft_trascendence/game_engine/index.html'
  else
    authorization_url = CLIENT.auth_code.authorize_url(redirect_uri: REDIRECT_URI)
    redirect authorization_url
  end
end

before do
  # Escludi il percorso di logout dalla logica del controllo della sessione
  if request.path != '/logout'
    # Se una sessione è già attiva e l'ID della sessione è diverso, mostra un messaggio di avvertimento
    if $active_session_id && $active_session_id != session.id
      halt 403, "<html><body><h1>Hai già una sessione attiva con un altro account!</h1><p>Per favore, termina la sessione precedente prima di procedere.</p></body></html>"
    end
  end
end

get '/login' do
  if session[:user_authenticated]
    # Se l'utente è già autenticato, reindirizzalo alla home
    redirect to('/')
  else
    # Se non è autenticato, mostra il messaggio di uscita
    "<html><body><h1>Sei uscito con successo!</h1><p><a href='/'>Clicca qui per accedere di nuovo</a></p></body></html>"
  end
end


get '/' do
  if session[:user_authenticated] && $active_session_id == session.id
    redirect 'http://localhost:8000/ft_trascendence/game_engine/index.html'
  else
    authorization_url = CLIENT.auth_code.authorize_url(redirect_uri: REDIRECT_URI)
    redirect authorization_url
  end
end

get '/callback' do
  if session[:user_authenticated]
    redirect 'http://localhost:8000/ft_trascendence/game_engine/index.html'
  end

  begin
    code = params[:code]
    token = CLIENT.auth_code.get_token(code, redirect_uri: REDIRECT_URI)
    user_info = token.get("/v2/me").parsed
    username = user_info["login"]
    email = user_info["email"]

    session[:access_token] = token.token
    session[:user_authenticated] = true
    $active_session_id = session.id

    redirect 'http://localhost:8000/ft_trascendence/game_engine/index.html'
  rescue OAuth2::Error => e
    settings.logger.error("Autenticazione fallita: #{e.message}")
    halt 500, "Errore nell'autenticazione. Per favore, riprova più tardi."
  end
end

# Route per il logout
post '/logout' do
  if session[:access_token]
    begin
      token = OAuth2::AccessToken.new(CLIENT, session[:access_token])
      revoke_url = CLIENT.site + '/oauth/revoke'
      response = CLIENT.request(:post, revoke_url, body: { token: token.token })
      
      if response.status != 200
        settings.logger.error("Errore durante la revoca del token: #{response.status}")
      end
    rescue OAuth2::Error => e
      settings.logger.error("Errore durante la revoca del token: #{e.message}")
    ensure
      session.clear
    end
  end

  redirect to('/')
end