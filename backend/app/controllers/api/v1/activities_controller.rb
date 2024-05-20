module Api
  module V1
    class ActivitiesController < ApplicationController
      before_action :authenticate_request

      def create
        activity = @current_user.activities.build(activity_params)

        
        if activity.save
          # ユーザーの連続記録日数、特別モードのアンロック、達成回数を更新
          update_user_status(activity.created_at.to_date)
          render json: activity, status: :created
        else
          render json: activity.errors, status: :unprocessable_entity
        end
      end

      private

      def activity_params
        params.require(:activity).permit(:action, :category_id, :minute)
      end

      def update_user_status(activity_date)
        last_activity_date = @current_user.activities.order(created_at: :desc).second&.created_at&.to_date
        last_special_unlocked_date = @current_user.last_special_unlocked_date
        
        if @current_user.activities.where(created_at: activity_date.all_day).count > 1
          # 同じ日付の活動が既に存在する場合は、連続記録日数を加算しない
          consecutive_days = @current_user.consecutive_days
          Rails.logger.info("同じ日付の活動が既に存在する場合は、連続記録日数を加算しない")
        elsif last_activity_date == activity_date - 1.day
          # 連続している場合は、連続記録日数を1加算
          consecutive_days = @current_user.consecutive_days + 1
          Rails.logger.info("連続している場合は、連続記録日数を1加算")
        else
          # 連続していない場合は、連続記録日数を1にリセット
          consecutive_days = 1
          Rails.logger.info("連続していない場合は、連続記録日数を1にリセット")
        end
        
        special_mode_unlocked = consecutive_days >= 3 ? true : @current_user.special_mode_unlocked
        achievement = special_mode_unlocked ? @current_user.achievement + 1 : @current_user.achievement

        if special_mode_unlocked
          # 特典条件を満たした場合は、consecutive_daysを0にリセット
          consecutive_days = 0
        end
        
        @current_user.update(
          consecutive_days: consecutive_days,
          special_mode_unlocked: special_mode_unlocked,
          last_special_unlocked_date: special_mode_unlocked ? activity_date : @current_user.last_special_unlocked_date,
          achievement: achievement
          )
        end
      end
    end
  end