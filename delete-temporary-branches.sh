#!/bin/bash
# Script to delete temporary branches
# Keep: dev, prod, simple
# Delete: All other branches

set -e

echo "🗑️  Branch Cleanup Script"
echo "=========================="
echo ""
echo "Branches to keep: dev, prod, simple"
echo "All other branches will be deleted."
echo ""

# List of branches to delete
BRANCHES_TO_DELETE=(
  "copilot/abandon-forbidden-workflow"
  "copilot/add-gu-gong-card-icon"
  "copilot/add-issue-template-for-museum-data"
  "copilot/delete-temporary-branches"
  "copilot/disable-museum-guide-cards"
  "copilot/fix-01d85aae-e251-4e38-a9b6-b1a056f52c04"
  "copilot/fix-16145438-3996-475f-9e4a-9e9fe10cdb2e"
  "copilot/fix-19b841f6-978c-4449-b879-7747c27c6e8c"
  "copilot/fix-20c856d0-507e-4972-be31-79d051712a45"
  "copilot/fix-222373fe-8a69-41b0-9501-7ee4305119d1"
  "copilot/fix-297"
  "copilot/fix-312"
  "copilot/fix-5e5f16ac-19bf-4356-a449-e6707767ee0b"
  "copilot/fix-63799596-199f-49d2-b7fb-5897bba5932f"
  "copilot/fix-checkin-refresh-bug"
  "copilot/fix-checkin-task-fireworks"
  "copilot/fix-child-nickname-input"
  "copilot/fix-d5e5e9ed-3d75-4c71-857b-ccc3dfb06601"
  "copilot/fix-e59766c2-ac76-4cde-afbe-2176a932da9c"
  "copilot/fix-inline-baidu-img-search"
  "copilot/fix-national-treasures-images"
  "copilot/fix-tier1-data-display-issue"
  "copilot/fix-tier1-data-loading"
  "copilot/fix-zhen-guan-zhi-bao-task"
  "copilot/generate-qrcode-for-museums"
  "copilot/test-checkin-page-functionality"
  "copilot/update-ranking-system"
  "copilot/verify-photos-url-accessibility"
  "jackandking-patch-1"
  "jackandking-patch-2"
  "jackandking-patch-2-1"
)

echo "Total branches to delete: ${#BRANCHES_TO_DELETE[@]}"
echo ""

# Delete remote branches
for branch in "${BRANCHES_TO_DELETE[@]}"; do
  echo "Deleting remote branch: $branch"
  git push origin --delete "$branch" 2>/dev/null || echo "  ⚠️  Branch $branch does not exist or already deleted"
done

echo ""
echo "✅ Branch cleanup completed!"
echo ""
echo "Remaining branches:"
git ls-remote --heads origin | grep -E "(dev|prod|simple)" || echo "No matching branches found"
