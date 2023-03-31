
echo "   ==================="
echo "   = AUTO COMMIT ="
echo "   ===================" 

read -p "What is your commit message: " commit_msg

# commit & push github
git add .
git commit -m "$commit_msg"
git push

echo "Done!!"