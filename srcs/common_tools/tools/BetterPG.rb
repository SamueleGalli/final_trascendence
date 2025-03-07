# BetterPG.rb

require 'pg'
require 'timeout'

DEBUG_PG_ADDRESS = '172.18.0.2' unless defined? DEBUG_PG_ADDRESS

module BetterPG
  class EmptyNameRequest < StandardError
    def initialize(msg = 'Empty table name requested')
      super msg
    end
  end

  class RiskOfFullDeletion < StandardError
    def initialize(msg = 'Risk of deleting all tables. Table name contains wildcard')
      super msg
    end
  end

  class SimplePG
    def initialize(name = '', columns = [])
      @original_cols = columns
      name ||= ''
      Timeout.timeout(5) do
        r = nil
        begin
          Timeout.timeout(1) do
            @pg = PG.connect('host=postgres port=5432 password=pwd_postgres user=databaser')
          end
        rescue StandardError => r
          @pg = PG.connect('host=' + DEBUG_PG_ADDRESS + ' port=5432 password=pwd_postgres user=databaser') if r.nil?
        end
      end
      @name = name
      puts 'Succesfully connected to database.'
      checkoutTable name, columns if name
    end

    def better_columns(colols)
      res = []
      colols.each do |c|
        res.append c[0..c.rindex(' ').to_i - 1]
      end
      res
    end

    def getColumns
      @columns
    end

    # change target table
    def checkoutTable(newname = '', columns = [])
      newname ||= ''
      raise EmptyNameRequest if newname == ''

      @name = newname
      createTable columns
    end

    # returns true if creation was succesful, false if table already exists. Ensires requested columns are created if not present
    def createTable(columns = [], rewrite = false)
      if rewrite
        puts 'overwriting table ' + @name
        dropTable
      end
      begin
        exec 'CREATE TABLE ', @name, ' (', columns.join(', '), ');'
      rescue PG::DuplicateTable
        addColumns(*columns)
        @columns = better_columns columns
        puts 'Table already initialized. Utilizing old table ' + @name # if Ports::DEBUG_MODE
        return false
      end
      @columns = better_columns columns
      puts 'Created new table ' + @name # if Ports::DEBUG_MODE
      true
    end

    # add columns to current table. ELEMENTS MUST CONTAIN DATA TYPE
    def addColumns(*columns)
      print 'Creating columns ' # if Ports::DEBUG_MODE
      columns.each do |c|
        exec 'ALTER TABLE', @name, 'ADD', c
        print c, ' ' # if Ports::DEBUG_MODE
      rescue PG::DuplicateColumn
      end
    end

    def better_return(obj = [])
      r = nil
      reslst = []
      return [] if obj.nil?
      
      obj.each do |lol|
        reslst.append lol
      rescue StandardError
        r
      end
      reslst
    end

    # perform select for data fetching
    def select(cols = [], keys = [], fullkeys = [], logic = 'AND')
      raise 'Bad logic identifier' unless %w[AND OR].include? logic

      req = []
      begin
        req = ['SELECT ' + @columns.join(', ') + ' FROM', @name]
        t = []
        keys.each_with_index do |k, i|
          t.append cols[i] + "='" + k.to_s + "'" if i < cols.count && cols[i] && k && !k.to_s.empty?
        end
        req.append('WHERE ' + t.join(' ' + logic + ' ')) unless t.empty?
        fullkeys.each do |k|
          req.append 'WHERE ' + k.to_s if k && !k.to_s.empty?
        end
        better_return exec(req)
      rescue PG::UndefinedColumn, IndexError => e
        puts e
        [{}]
      end
    end

    def delete(cols = [], keys = [], fullkeys = [])
      req = []
      begin
        req = ['DELETE FROM', @name]
        keys.each_with_index do |k, i|
          req.append 'WHERE ' + cols[i] + '=' + k if k
        end
        fullkeys.each do |k|
          req.append 'WHERE ' + k
        end
        res = exec req
        puts 'Deleted from ' + @name
        res if res
      rescue PG::UndefinedColumn, IndexError => e
        puts e
        [{}]
      end
    end

    def addValues(vals = [], format = [])
      format = @columns[0, vals.size] if format == []
      exec 'INSERT INTO', @name, (format.size != 0 ? '(' + format.join(', ') + ')' : ''), 'VALUES',
           "('" + vals.join("', '") + "')"
      puts 'Added ' + vals.to_s + ' as ' + format.to_s + ' to ' + @name
    end

    # send a query like this: 'UPDATE table SET set_key1 = set_val1, set_key2 = set_val2, ... WHERE key = val'. KEY VAL PAIR MUST BE UNIVOQUE
    def updateValue(key = '', val = '', set = {})
      req = ['UPDATE', @name, 'SET']
      t = []
      set.each do |k, v|
        t << "#{k} = '#{v}'" if k && v
      end
      req << t.join(',')
      req.append ['WHERE', key, '=', "'#{val}'"]
      exec req
    end

    # send a query like this: 'UPDATE table SET #{string} WHERE key = val'. KEY VAL PAIR MUST BE UNIVOQUE
    def valueManipulation(key, val, string = "")
      return [{}] if string.nil? || string.empty?

      exec ['UPDATE', @name, 'SET', string, 'WHERE', key, '=', "'#{val}'"]
    end

    # drop column from current table
    def dropColumns(columns = [])
      columns.each do |c|
        exec 'ALTER TABLE', @name, 'DROP COLUMN', c
        puts 'Dropping ' + c.to_s
        @columns.delete c if @columns.include? c
      rescue StandardError => e
        puts e
      end
    end

    def dropTable(iamsure = false)
      raise RiskOfFullDeletion if @name.include?('*') && !iamsure

      exec 'DROP TABLE', @name
    end

    def zeroTable
      createTable @original_cols, true
    end

    def exec(*strs)
      puts strs.join(' ')
      return @pg.exec(strs.join(' ')) if strs.size != 0

      [{}]
    end
  end
end
