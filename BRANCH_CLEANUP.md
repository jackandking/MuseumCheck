# Branch Cleanup Instructions

## Objective
保留dev，prod，simple，删除其他临时branch (Keep dev, prod, simple branches; delete all other temporary branches)

## Branches to Keep (3)
- ✅ `dev` - Development branch
- ✅ `prod` - Production branch
- ✅ `simple` - Simple branch

## Branches to Delete (32 temporary branches)

### Method 1: Delete All Temporary Branches at Once

Run this single command to delete all temporary branches:

```bash
git push origin --delete \
  copilot/abandon-forbidden-workflow \
  copilot/add-gu-gong-card-icon \
  copilot/add-issue-template-for-museum-data \
  copilot/delete-temporary-branches \
  copilot/disable-museum-guide-cards \
  copilot/fix-01d85aae-e251-4e38-a9b6-b1a056f52c04 \
  copilot/fix-16145438-3996-475f-9e4a-9e9fe10cdb2e \
  copilot/fix-19b841f6-978c-4449-b879-7747c27c6e8c \
  copilot/fix-20c856d0-507e-4972-be31-79d051712a45 \
  copilot/fix-222373fe-8a69-41b0-9501-7ee4305119d1 \
  copilot/fix-297 \
  copilot/fix-312 \
  copilot/fix-5e5f16ac-19bf-4356-a449-e6707767ee0b \
  copilot/fix-63799596-199f-49d2-b7fb-5897bba5932f \
  copilot/fix-checkin-refresh-bug \
  copilot/fix-checkin-task-fireworks \
  copilot/fix-child-nickname-input \
  copilot/fix-d5e5e9ed-3d75-4c71-857b-ccc3dfb06601 \
  copilot/fix-e59766c2-ac76-4cde-afbe-2176a932da9c \
  copilot/fix-inline-baidu-img-search \
  copilot/fix-national-treasures-images \
  copilot/fix-tier1-data-display-issue \
  copilot/fix-tier1-data-loading \
  copilot/fix-zhen-guan-zhi-bao-task \
  copilot/generate-qrcode-for-museums \
  copilot/test-checkin-page-functionality \
  copilot/update-ranking-system \
  copilot/verify-photos-url-accessibility \
  jackandking-patch-1 \
  jackandking-patch-2 \
  jackandking-patch-2-1
```

### Method 2: Use the Provided Script

Run the automated cleanup script:

```bash
chmod +x delete-temporary-branches.sh
./delete-temporary-branches.sh
```

### Method 3: Delete Branches Individually

If you prefer to delete branches one by one:

```bash
# Copilot branches
git push origin --delete copilot/abandon-forbidden-workflow
git push origin --delete copilot/add-gu-gong-card-icon
git push origin --delete copilot/add-issue-template-for-museum-data
git push origin --delete copilot/delete-temporary-branches
git push origin --delete copilot/disable-museum-guide-cards
git push origin --delete copilot/fix-01d85aae-e251-4e38-a9b6-b1a056f52c04
git push origin --delete copilot/fix-16145438-3996-475f-9e4a-9e9fe10cdb2e
git push origin --delete copilot/fix-19b841f6-978c-4449-b879-7747c27c6e8c
git push origin --delete copilot/fix-20c856d0-507e-4972-be31-79d051712a45
git push origin --delete copilot/fix-222373fe-8a69-41b0-9501-7ee4305119d1
git push origin --delete copilot/fix-297
git push origin --delete copilot/fix-312
git push origin --delete copilot/fix-5e5f16ac-19bf-4356-a449-e6707767ee0b
git push origin --delete copilot/fix-63799596-199f-49d2-b7fb-5897bba5932f
git push origin --delete copilot/fix-checkin-refresh-bug
git push origin --delete copilot/fix-checkin-task-fireworks
git push origin --delete copilot/fix-child-nickname-input
git push origin --delete copilot/fix-d5e5e9ed-3d75-4c71-857b-ccc3dfb06601
git push origin --delete copilot/fix-e59766c2-ac76-4cde-afbe-2176a932da9c
git push origin --delete copilot/fix-inline-baidu-img-search
git push origin --delete copilot/fix-national-treasures-images
git push origin --delete copilot/fix-tier1-data-display-issue
git push origin --delete copilot/fix-tier1-data-loading
git push origin --delete copilot/fix-zhen-guan-zhi-bao-task
git push origin --delete copilot/generate-qrcode-for-museums
git push origin --delete copilot/test-checkin-page-functionality
git push origin --delete copilot/update-ranking-system
git push origin --delete copilot/verify-photos-url-accessibility

# Patch branches
git push origin --delete jackandking-patch-1
git push origin --delete jackandking-patch-2
git push origin --delete jackandking-patch-2-1
```

## Verification

After deletion, verify that only the three branches remain:

```bash
git ls-remote --heads origin
```

Expected output should show only:
- `refs/heads/dev`
- `refs/heads/prod`
- `refs/heads/simple`

## Notes

- The current working branch `copilot/delete-temporary-branches` will also be deleted after this PR is merged
- All these branches are temporary and can be safely deleted
- Make sure to run these commands from a machine with appropriate GitHub access
