# frozen_string_literal: true

class ZilogController < ApplicationController
  protect_from_forgery with: :null_session

  PREFIX    = ['', '#', '$', '0x'].freeze
  SEPARATOR = ['_', ',', ',_'].freeze
  DEFINE    = ['none', 'db', 'defb', 'dw', 'defw'].freeze
  BASIC     = ['none', 'DATA', 'DB', 'DEFB'].freeze

  before_action :check_file
  before_action :converter, only: [:converter_hex, :converter_dec]

  def index; end

  def disasm
    @org = 32_768
    return if @error

    file = params[:demo] == 'true' ? demo : params[:file]
    service = Z80Disassembler::Disassembler.new(file, params[:org])
    @result    = service.start
    @file_size = service.file_size
    @org       = service.org
    render layout: false
  end

  def compile
    file = Tempfile.new(file_name)
    file.write(params[:file])
    file.write(Z80Disassembler::Disassembler.compile_text(file_name))
    file.close
    @compiled = system "sjasmplus --nologo #{file.path} 2> #{file_name}.log"
    @logs = File.read("#{file_name}.log").split("\n")
    render layout: false
  end

  def emulator; end

  def converter_hex
    return if @error

    @result = @converter.hex
    render layout: false
  end

  def converter_dec
    @values = (1..16).to_a + (5..10).map { |x| 2**x } + [6912]
    return if @error

    @result = @converter.dec
    render layout: false
  end

  def download_tap = send_file("#{file_name}.tap", filename: 'disasm.tap')
  def download_sna = send_file("#{file_name}.sna", filename: 'disasm.sna')
  def download_hob = send_file("#{file_name}.$C",  filename: 'disasm.$C' ) # rubocop:disable Layout/SpaceInsideParens
  def download_cod = send_file("#{file_name}.bin", filename: 'disasm.bin')

  private

  def demo
    ActionDispatch::Http::UploadedFile.new(tempfile: File.open('snow16.$C'), filename: 'snow16.$C')
  end

  def file_name
    return @file_name if @file_name

    dir = current_user ? "tmp/users/user_#{current_user.id.to_s(16).rjust(4, '0')}" : 'tmp'
    FileUtils.mkdir_p(dir)
    @file_name = "#{dir}/disasm"
  end

  def converter
    return if @error

    @converter = Converter.new(params)
    @file_size = @converter.file_size
  end

  def check_file
    @result = if params[:file].nil? || params[:file] == 'undefined'
                'File not found'
              elsif params[:file].size > (1024 * 1024)
                'File size > 1mb'
              end
    @error = @result.present? && params['demo'] != 'true'
  end
end
