# frozen_string_literal: true

class AssetUrlProcessor
  def self.call(input)
    context = input[:environment].context_class.new(input)
    data = input[:data].gsub(/asset-url\(["']?(.+?)["']?\)/) do |_match|
      "url(#{context.asset_path(::Regexp.last_match(1))})"
    end
    { data: }
  end
end

Sprockets.register_postprocessor 'text/css', AssetUrlProcessor
