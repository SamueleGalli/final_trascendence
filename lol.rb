require 'socket'

s = TCPServer.new 9050
rd = [s]

t = IO::select rd
if t[0][0].class.to_s == "TCPServer"
  c = t[0][0].accept
  c.print "ajkdhkashjkhdaskj"
end