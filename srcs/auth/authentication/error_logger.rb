require 'colorize'

def log_error_details(req, status, body, logger)
    ip = req.peeraddr[3]
    method = req.request_method
    path = req.path
    headers = req.header.to_s
    body_content = body.join

    log_message = "[#{Time.now}] #{status} - #{method} #{path} from #{ip}\n"
    log_message += "Request Headers: #{headers}\n"
    log_message += "Response Body: #{body_content[0..500]}\n"

    case status
    when 200..299
        logger.info(log_message.green)
    when 300..399
        logger.warn(log_message.yellow)
    when 400..499
        logger.error(log_message.red)
    when 500..599
        logger.fatal(log_message.bold.red)
    else
        logger.debug(log_message.blue)
    end
end
