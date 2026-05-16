# Umeng analytics — keep public SDK surface intact in release builds.
-keep class com.umeng.** { *; }
-keep class com.uc.** { *; }
-keep class com.efs.** { *; }
-keep class org.repackage.** { *; }
-dontwarn com.umeng.**
-dontwarn com.uc.**
-dontwarn com.efs.**
