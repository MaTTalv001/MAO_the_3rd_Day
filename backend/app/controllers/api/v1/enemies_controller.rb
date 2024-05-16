module Api
  module V1
    class EnemiesController < ApplicationController
      skip_before_action :authenticate_request, only: [:random]
      def random
        enemy = Enemy.order("RAND()").first
        render json: enemy
      end
    end
  end
end

