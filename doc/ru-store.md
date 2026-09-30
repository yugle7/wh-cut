```bash
java -jar pepk.jar --keystore android.keystore --alias android --output ruStore/pepk_out.zip --encryptionkey=... --include-cert
```

```bash
keytool -export -rfc -alias android -file upload_cert.pem -keystore android.keystore
```