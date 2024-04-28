module Api
  module V1
    class ItemsController < ApplicationController
      skip_before_action :authenticate_request, only: [:index]
      def index
        @items = Item.all
        render json: @items
      end
    end
  end
end