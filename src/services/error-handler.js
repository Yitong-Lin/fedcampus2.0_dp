class ErrorHandler {  
  /**  
   * 处理网络错误  
   */  
  static handleNetworkError(error) {  
    console.error('网络错误:', error);  
      
    if (error.code === 'NETWORK_ERROR') {  
      return {  
        type: 'NETWORK_ERROR',  
        message: '网络连接失败，请检查网络设置',  
        userMessage: '请确保您连接到DKU网络！'  
      };  
    }  
      
    if (error.code === 'TIMEOUT') {  
      return {  
        type: 'TIMEOUT',  
        message: '请求超时',  
        userMessage: '网络连接超时，请重试'  
      };  
    }  
      
    return {  
      type: 'UNKNOWN_NETWORK_ERROR',  
      message: error.message || '未知网络错误',  
      userMessage: '网络连接出现问题，请稍后重试'  
    };  
  }  
  
  /**  
   * 处理认证错误  
   */  
  static handleAuthError(error) {  
    console.error('认证错误:', error);  
      
    if (error.code === 50005) {  
      return {  
        type: 'AUTH_ERROR',  
        message: '用户未认证',  
        userMessage: '请先登录您的健康数据账户'  
      };  
    }  
      
    if (error.status === 401) {  
      return {  
        type: 'TOKEN_EXPIRED',  
        message: '登录已过期',  
        userMessage: '登录已过期，请重新登录'  
      };  
    }  
      
    return {  
      type: 'UNKNOWN_AUTH_ERROR',  
      message: error.message || '认证失败',  
      userMessage: '认证失败，请重新登录'  
    };  
  }  
  
  /**  
   * 处理数据错误  
   */  
  static handleDataError(error) {  
    console.error('数据错误:', error);  
      
    if (error.type === 'VALIDATION_ERROR') {  
      return {  
        type: 'DATA_VALIDATION_ERROR',  
        message: '数据格式验证失败',  
        userMessage: '健康数据格式不正确',  
        details: error.errors  
      };  
    }  
      
    if (error.type === 'ENCRYPTION_ERROR') {  
      return {  
        type: 'ENCRYPTION_ERROR',  
        message: '数据加密失败',  
        userMessage: '数据处理出现问题，请重试'  
      };  
    }  
      
    return {  
      type: 'UNKNOWN_DATA_ERROR',  
      message: error.message || '数据处理错误',  
      userMessage: '数据处理出现问题，请重试'  
    };  
  }  
  
  /**  
   * 统一错误处理入口  
   */  
  static handleError(error, context = '') {  
    const errorInfo = {  
      timestamp: new Date().toISOString(),  
      context,  
      originalError: error  
    };  
      
    // 根据错误类型分类处理  
    if (error.name === 'NetworkError' || error.code === 'NETWORK_ERROR') {  
      return { ...errorInfo, ...this.handleNetworkError(error) };  
    }  
      
    if (error.status === 401 || error.code === 50005) {  
      return { ...errorInfo, ...this.handleAuthError(error) };  
    }  
      
    if (error.type && error.type.includes('DATA')) {  
      return { ...errorInfo, ...this.handleDataError(error) };  
    }  
      
    // 默认错误处理  
    return {  
      ...errorInfo,  
      type: 'UNKNOWN_ERROR',  
      message: error.message || '未知错误',  
      userMessage: '操作失败，请稍后重试'  
    };  
  }  
  
  /**  
   * 显示用户友好的错误消息  
   */  
  static showUserError(error) {  
    const errorInfo = this.handleError(error);  
      
    // 这里可以集成Toast或Alert组件  
    console.warn('用户错误提示:', errorInfo.userMessage);  
      
    // 如果使用react-native-toast-message  
    // Toast.show({  
    //   type: 'error',  
    //   text1: '操作失败',  
    //   text2: errorInfo.userMessage  
    // });  
      
    return errorInfo;  
  }  
}  
  
export default ErrorHandler;
