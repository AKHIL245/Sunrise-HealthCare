var config = {};

config.REGION = process.env.AWS_REGION
config.USERPOOLID = 'us-west-2_H8jEy5Hng' // please add you cognito user pool id, you can run amplify auth console and select 'User Pool option'
config.JWKS = '{"keys":[{"alg":"RS256","e":"AQAB","kid":"iyRX+vBJarePVvfCFlEChEJmX1tauNS4wDlMJXnRQk4=","kty":"RSA","n":"rlLsrHcVTFZ4Y_Wqu_Qky5jJZ9lXTLo9wG2A4bNS5zoMep1YzB9pX6jy6KXe8YHQxqR_hs3fmujtgn0B272IfqWBL1Q5ChVMzS0Ma7NclDKBtCsDG9iYttXN_Hf_h6JavkQg6ibOmOhTwnVhts8HuduALgVEtn3BrlAJv4spHN0W9H864CxfNaaLCxG_7CwGqUp9K4FGUNp9HToIS7Nrsl3gLeHTqbxzrvDzdRbWylM3p4WEU7nbAk8asFn9jX5ZW6SQ3SsG_BWAEdl4fFrczVken_25fIqSHMaIlSNu351kPOemR6NW0Hkkh9v8TZW3TPXhSefzQCVqFq-5dl2PFQ","use":"sig"},{"alg":"RS256","e":"AQAB","kid":"VEZLLrKz02+moWnCZrBj1mbDLDWW4sJEL99x/rt4MsQ=","kty":"RSA","n":"4eNPFa5ZiOiDGtkXE6vrCC7szUiwV6zyohObOEK9uTM-0H35b91yv45XLNXpoR9JGPOaSmr3g-F-7n0nJtqLCd93aw0JCdEnN9bvKB2sIF5QaIWE4uyw1TGHwAOFMVXIlX82EVv38o0itbG16_OJ_PDwp7jO7uUvfelWaem-3KV7FFya7m7cJpbG0ewdYWUTgl3pwy3AwywWiwoGEmerqsPM-TDjYCLaPLSOuOalB86EwxhbZ0WOZALJE9eyAnCbeyg_kgHV1BLEkBVzSzeV7pt7Io8Yk_EJ13s-KkZtyIkoC6D0BMJnAwd98hplfrzrly43vE4uvgnAo2vdSmfWjQ","use":"sig"}]}' //'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_H8jEy5Hng/.well-known/jwks.json' // from the cognito well-known JWKS
module.exports = config;

/// version 0.1.7