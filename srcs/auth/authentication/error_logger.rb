def log_error_details(req, status, body, logger)
    if status >= 400
        ip = req.peeraddr[3]
        method = req.request_method
        path = req.path
        headers = req.header.to_s
        body_content = body.join

        error_message = "ERROR #{status} - #{method} #{path} from #{ip}\n"
        error_message += "Request Headers: #{headers}\n"
        error_message += "Response Body: #{body_content[0..500]}\n"
        
        case status
        when 404
            logger.error(error_message.red) 
        when 500
            logger.error(error_message.bold.red) 
        when 403
            logger.error(error_message.yellow) 
        when 400
            logger.error(error_message.light_red) 
        else
            logger.error(error_message) 
        end
    end
end
