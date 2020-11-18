var GMAIL_SEARCH_QUERY = 'CSVテスト';
var ATTACHMENT_NAME = 'sample.csv';

function getNewestCSVFromGmailAttachment() {
  // 最新5件まで検索する
  var thread = GmailApp.search(GMAIL_SEARCH_QUERY, 0, 5);
  var messagesArray = GmailApp.getMessagesForThreads(thread);

  // 最新の添付ファイルを変数にいれる
  var newestAttachment, newestAttachmentDate;
  for (var i in messagesArray) {
    var messages = messagesArray[i];
    for (var mi in messages) {
      var m = messages[mi];
      var attachments = m.getAttachments();
      for (var ai in attachments) {
        var a = attachments[ai];
        var dt = m.getDate();
        // 該当するファイル名かチェック
        if (a.getName() != ATTACHMENT_NAME) {
          continue;
        }
        // より新しければ入れ直す
        if (!newestAttachmentDate || newestAttachmentDate < dt) {
          newestAttachment = a;
          newestAttachmentDate = dt;
        }
      }
    }
  }

  if (!newestAttachment) {
    return null;
  }
  // CSVを配列にして返す
  return Utilities.parseCsv(newestAttachment.copyBlob().getDataAsString());
}

var ss = SpreadsheetApp.openById("1bdcdzIMjLozKtVVBhN04lgPHtFbX1WErLloPOX-iBB0");
// var sh = ss.setActiveSheet(getTargetSheet(ss.getSheets(), "シート1"));
var sh = ss.getSheetByName("シート1");


function importCsv(){
  // メールから最新のCSVを取得
  var csv = getNewestCSVFromGmailAttachment();
  // シートをまっさらにする
  sh.clear();
  // シートに書き込み
  sh.getRange(1, 1, csv.length, csv[0].length).setValues(csv);
}