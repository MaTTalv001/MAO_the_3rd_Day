class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_request, only: [:index, :show]
  # GET /api/v1/users
  def index
    @users = User.all
    render json: @users.map { |user| user.as_json(index_view: true) } #as_json内分岐で情報量を絞る
  end

  # GET /api/v1/users/:id
  def show
    @user = User.includes(:avatars, :activities, :user_statuses, :items).find(params[:id])
    if @user
      render json: @user
    else
      render json: { error: "User not found" }, status: :not_found
    end
  rescue StandardError => e
    Rails.logger.error("Error in UsersController#show: #{e.message}")
    render json: { error: "Internal Server Error" }, status: :internal_server_error
  end


  # PATCH/PUT /api/v1/users/:id
  def update
    @user = User.find(params[:id])
    if @user.update(update_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/:id
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    head :no_content
  end

  # /api/v1/users/current

  def current
    if @current_user
      render json: { user: @current_user }
    else
      render json: { error: 'Not Authorized' }, status: :unauthorized
    end
  end

  def purchase
    item = Item.find(params[:item_id])
    user = @current_user

    if user.coin.amount >= item.cost
      ActiveRecord::Base.transaction do
        user.coin.amount -= item.cost
        user.coin.save!

        user_item = user.users_items.find_or_initialize_by(item_id: item.id)
        user_item.amount ||= 0
        user_item.amount += 1
        user_item.save!
      end

      render json: @current_user.as_json(include: [coin: { only: [:amount] }, items: { only: [:id, :name, :cost, :item_url, :category] }]), status: :ok
    else
      render json: { error: "Insufficient coins" }, status: :unprocessable_entity
    end
  end

  def consume_item
  user = @current_user
  item = Item.find(params[:item_id])

  user_item = user.users_items.find_by(item_id: item.id)
  if user_item && user_item.amount > 0
    user_item.amount -= 1
    if user_item.amount <= 0
      user_item.destroy
    else
      user_item.save!
    end
    render json: user.as_json(include: [coin: { only: [:amount] }, items: { only: [:id, :name, :cost, :item_url, :category] }]), status: :ok
  else
    render json: { error: "Item not found or insufficient amount" }, status: :unprocessable_entity
  end
end

  def gain_coins
  user = @current_user
  base_amount = params[:base_amount].to_i
  charisma_bonus = user.latest_status.charisma * 0.01
  total_amount = (base_amount * (1 + charisma_bonus)).floor

  logger.info "Base amount: #{base_amount}"
  logger.info "Charisma bonus: #{charisma_bonus}"
  logger.info "Total amount: #{total_amount}"

  user.coin.amount += total_amount

  if user.coin.save
    render json: {
      user: user.as_json(include: { coin: { only: [:amount] } }),
      gained_coins: total_amount
    }, status: :ok
  else
    render json: { error: "金貨獲得処理に失敗しました" }, status: :unprocessable_entity
  end
end

  private

  def user_params
    params.require(:user).permit(:nickname, :name, :email, :password, :password_confirmation, :base_amount)
  end

  def update_params
    params.require(:user).permit(:nickname, :profile)
  end

  
end