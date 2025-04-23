plugins {
    id("com.android.application")
    id("com.google.gms.google-services") // Plugin do Google Services
}

dependencies {
    // Import the Firebase BoM
    implementation(platform("com.google.firebase:firebase-bom:33.12.0"))

    // Adicione os SDKs do Firebase que você deseja usar
    implementation("com.google.firebase:firebase-analytics")
    implementation("com.google.firebase:firebase-auth")
    implementation("com.google.firebase:firebase-firestore")
}