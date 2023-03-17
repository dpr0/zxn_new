# frozen_string_literal: true

class Converter
  attr_reader :file_size

  def initialize(params)
    @size      = params[:size]&.to_i               || 1
    @prefix    = params[:prefix]                   || '#'
    @splitter  = params[:splitter]&.to_i           || 8
    @separator = params[:separator]&.sub('_', ' ') || ', '
    @define    = params[:define]&.sub('none', '')  || ''
    @array     = []
    @file      = File.open(params[:file])
    @file_size = @file.size
  end

  def hex
    @file.each_byte { |byte| @array << byte.to_s(16).rjust(2, '0') }
    @array = @array.each_slice(@size).map(&:join).map { |str| @prefix + str }
    join_to_str
  end

  def dec
    @file.each_byte { |byte| @array << byte.to_s }
    join_to_str
  end

  private

  def join_to_str
    @array.each_slice(@splitter).to_a.map do |str|
      z = str.join(@separator)
      @define.present? ? "\t#{@define} #{z}" : z
    end.join("\n")
  end
end
