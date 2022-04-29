package com.popsocial;
import android.os.Bundle;
import com.popsocial.R;
import com.facebook.react.ReactActivity;
import com.zoontek.rnbootsplash.RNBootSplash;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

// Branch
// import io.branch.rnbranch.*; 
// import android.content.Intent; 

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Pop";
  }

  // // Branch implementation
  // @Override
  // public void onNewIntent(Intent intent) {
  //   super.onNewIntent(intent);
  //   RNBranchModule.onNewIntent(intent);
  // }

  @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      RNBootSplash.init(R.drawable.bootsplash, MainActivity.this); // <- display the generated bootsplash.xml drawable over our MainActivity
    }

    @Override
protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
        @Override
        protected ReactRootView createRootView() {
            return new RNGestureHandlerEnabledRootView(MainActivity.this);
        }
    };
}

}
