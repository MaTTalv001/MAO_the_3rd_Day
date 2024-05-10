class Api::V1::ActivityLikesController < ApplicationController
  before_action :authenticate_request

  def index
    activity = Activity.find(params[:activity_id])
    render json: { likes_count: activity.likes_count, liked: activity.liked_by?(@current_user) }
  end

  def create
    activity = Activity.find(params[:activity_id])
    @current_user.like_activity(activity)
    render json: { status: 'success', likes_count: activity.likes_count ,liked: activity.liked_by?(@current_user)}
  end

  def destroy
    activity = Activity.find(params[:activity_id])
    @current_user.unlike_activity(activity)
    render json: { status: 'success', likes_count: activity.likes_count, liked: activity.liked_by?(@current_user)}
  end
end