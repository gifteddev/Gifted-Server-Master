aws s3 cp ./scripts/gifted.css s3://gifted-script --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;
aws s3 cp ./scripts/script.js s3://gifted-script --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;
