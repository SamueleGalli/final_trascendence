# BetterPG.rb

require 'pg'
require 'timeout'

module BetterPG
  class EmptyNameRequest < StandardError
    def initialize(msg="Empty table name requested")
      super msg
    end
  end
  class RiskOfFullDeletion < StandardError
    def initialize(msg="Risk of deleting all tables. Table name contains wildcard")
      super msg
    end
  end
  
  class SimplePG
    def initialize(name="", columns=[])
      name ||= ""
      Timeout::timeout(5) {
        @pg = PG.connect("host=postgres port=5432 password=pwd_postgres user=databaser")
      }
      @name = name
      @columns = []
      puts "Succesfully connected to database."

      checkoutTable name, columns if name
    end
    
    def updateColumns()
      @columns = []
      begin
        (exec "SELECT * FROM", @name, "LIMIT 1")[0].each do |key, val|
          @columns.append key
        end
      rescue PG::UndefinedTable, IndexError => r
        return []
      end
      return @columns
    end
    def getColumns()
      return @columns
    end

  # change target table
    def checkoutTable(newname="", columns=[])
      newname ||= ""
      if newname == ""
        raise EmptyNameRequest
      end
      @name = newname
      createTable columns
      updateColumns
    end

    # returns true if creation was succesful, false if table already exists. Ensires requested columns are created if not present
    def createTable(columns=[], rewrite=false)
      if rewrite
        puts "overwriting table " + @name
        dropTable
      end
      begin
        exec "CREATE TABLE ", @name, " (", columns.join(", "), ");"
        puts "Created new table " + @name# if Ports::DEBUG_MODE
      rescue PG::DuplicateTable => r
        addColumns *columns
        return false
      end
      return true
    end

    # add columns to current table
    def addColumns(*columns)
      print "Creating columns "# if Ports::DEBUG_MODE
      columns.each do |c|
        begin
          exec "ALTER TABLE ", @name, " ADD ", c
          print c.to_s, ' '# if Ports::DEBUG_MODE
        rescue PG::DuplicateColumn => r
        end
      end
      puts ""# if Ports::DEBUG_MODE
      if columns.size != 0
        updateColumns
      end
    end

    # perform select for data fetching
    def select(cols=[], keys=[], fullkeys=[])
      cols = updateColumns if cols == []
      req = []
      begin
        req = ["SELECT", cols.join(", "), "FROM", @name]
        keys.each_with_index do |k, i|
          req.append "WHERE " + cols[i] + "=" + k if k
        end
        fullkeys.each do |k|
          req.append "WHERE " + k
        end
        res = exec req
        return res if res
      rescue PG::UndefinedColumn, IndexError => r
        puts r
        return [{}]
      end
    end

    def delete(cols=[], keys=[], fullkeys=[])
      cols = updateColumns if cols == []
      req = []
      begin
        req = ["DELETE FROM", @name]
        keys.each_with_index do |k, i|
          req.append "WHERE " + cols[i] + "=" + k if k
        end
        fullkeys.each do |k|
          req.append "WHERE " + k
        end
        res = exec req
        puts "Deleted from " + @name
        return res if res
      rescue PG::UndefinedColumn, IndexError => r
        puts r
        return [{}]
      end
    end

    def addValues(vals=[], format=[])
      format = getColumns[0, vals.size] if format == []
      exec "INSERT INTO", @name, (format.size != 0 ? "(" + format.join(", ") + ")" : ""), "VALUES", '(', vals.join(", "), ')'
      puts "Added " + vals.to_s + " as " + format.to_s + " to " + @name
    end

    # drop column from current table
    def dropColumns(columns=[])
      columns ||= getColumns
      columns.each do |c|
        begin
          exec "ALTER TABLE", @name, "DROP COLUMN", c
          puts "Dropping " + c.to_s
        rescue => r
          puts r
        end
      end
      if columns.size != 0
        updateColumns
      end
    end
    def dropTable(iamsure = false)
      if @name.include?('*') && !iamsure
        raise RiskOfFullDeletion
      end
      exec "DROP TABLE", @name
    end

    def exec(*strs)
      if strs.size != 0
        return @pg.exec(strs.join(' '))
      else
        return [{}]
      end
    end
  end
end
