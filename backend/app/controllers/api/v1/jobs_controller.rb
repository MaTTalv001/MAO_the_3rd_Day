module Api
  module V1
    class JobsController < ApplicationController
      before_action :authenticate_request

      def index
        jobs = Job.select(:id, :name)
        render json: jobs
      end
    end
  end
end