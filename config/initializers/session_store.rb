if Rails.env === 'production' 
    Rails.application.config.session_store :cookie_store, key: '_trackasset', domain: 'trackasset-json-api'
  else
    Rails.application.config.session_store :cookie_store, key: '_trackasset'
  end