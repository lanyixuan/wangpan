$(document).ready(function(){
	$("#headimg").click(function(){
		$("#headinfo").css("display","block");
	});
	
	$("#selall").click(function(){
		$(".seled").removeAttr("class");
		$(this).attr("class","seled");
		function(mainfile){
			$("#alllist").html(mainfile);
		},"text");
	})
	
	$("#seldoc").click(function(){
		$(".seled").removeAttr("class");
		$(this).attr("class","seled");
		function(mainfile){
			$("#alllist").html(mainfile);
		},"text");
	})
	
	$("#selimg").click(function(){
		$(".seled").removeAttr("class");
		$(this).attr("class","seled");
		function(mainfile){
			$("#alllist").html(mainfile);
		},"text");
	})
	
	$("#selmusic").click(function(){
		$(".seled").removeAttr("class");
		$(this).attr("class","seled");
		function(mainfile){
			$("#alllist").html(mainfile);
		},"text");
	})
	
	$("#selvideo").click(function(){
		$(".seled").removeAttr("class");
		$(this).attr("class","seled");
		function(mainfile){
			$("#alllist").html(mainfile);
		},"text");
	})
	
	$("#selexe").click(function(){
		$(".seled").removeAttr("class");
		$(this).attr("class","seled");
		function(mainfile){
			$("#alllist").html(mainfile);
		},"text");
	})
	
	$("#selzip").click(function(){
		$(".seled").removeAttr("class");
		$(this).attr("class","seled");
		function(mainfile){
			$("#alllist").html(mainfile);
		},"text");
	})
	
	$("#selother").click(function(){
		$(".seled").removeAttr("class");
		$(this).attr("class","seled");
		function(mainfile){
			$("#alllist").html(mainfile);
		},"text");
	})
	
	$("#sharetxt").click(function(){
		$(".seled").removeAttr("class");
		$(this).attr("class","seled");
		function(mainfile){
			$("#alllist").html(mainfile);
		},"text");
	})
	
	$("#recycle").click(function(){
		$(".seled").removeAttr("class");
		$(this).attr("class","seled");
		function(mainfile){
			$("#alllist").html(mainfile);
		},"text");
	})
	
	$("#upbutton").click(function(){
		$("#upinput").trigger("click");
	});
	
	$("#upinput").change(function(){
		if(!$("#upinput").val())
		{
			alert("没有选择文件");
			return;
		}
		file=this.files[0];
		var filesize=file.size
		if(filesize>4294967296)
		{
			alert("文件过大");
			return;
		}
		else
		{
			var buffer_size=4194304;		//4M
			var start=0;
			var hash="";
			var end= filesize > buffer_size ? buffer_size :filesize;
			var blob;
			var c=CryptoJS.algo.SHA1.create();
			function swapendian32(val) {
				return (((val & 0xFF) << 24)
				   | ((val & 0xFF00) << 8)
				   | ((val >> 8) & 0xFF00)
				   | ((val >> 24) & 0xFF)) >>> 0;
			}
			function arrayBufferToWordArray(arrayBuffer) {
				var fullWords = Math.floor(arrayBuffer.byteLength / 4);
				var bytesLeft = arrayBuffer.byteLength % 4;
				var u32 = new Uint32Array(arrayBuffer, 0, fullWords);
				var u8 = new Uint8Array(arrayBuffer);
				var cp = [];
				for (var i = 0; i < fullWords; ++i) {
					cp.push(swapendian32(u32[i]));
				}

				if (bytesLeft) {
					var pad = 0;
					for (var i = bytesLeft; i > 0; --i) {
						pad = pad << 8;
						pad += u8[u8.byteLength - i];
					}
					for (var i = 0; i < 4 - bytesLeft; ++i) {
						pad = pad << 8;
					}
					cp.push(pad);
				}

				return CryptoJS.lib.WordArray.create(cp, arrayBuffer.byteLength);
			};
			function readBlob(){
				blob = file.slice(start, end);
				reader.readAsArrayBuffer(blob);	
			}
			reader = new FileReader();
			readBlob();
			reader.onload = function (e){
				var wordArray=arrayBufferToWordArray(e.target.result);
				var b=c.update(wordArray);
				if(end !== filesize) {
				start += buffer_size;
				end += buffer_size;
				if(end > filesize) {
					end = filesize;
				}
				readBlob();
				}
				else
				{
					hash=c.finalize().toString();
					$.post("dohash.php",{hide:"4",hash:hash,filename:file.name},
					function(data){
						if(data!="1")
						{
							if(data=="0")
							{
								var filedata=new FormData();
								$.each($("#upinput")[0].files,function(i,upfile){
									filedata.append('hide',"4");
									filedata.append('hash',hash);
									filedata.append('upload_file',upfile);
								});
								$.ajax({
									url:'doupload.php',
									type:'POST',
									data:filedata,
									cache: false,
									contentType: false,
									processData: false,
									success:function(data1){
										if(data1=="1")
										{
											window.location.reload(true);
										}
										else
										{
											alert(data1);
										}
									}
								});
							}
							else
							{
								alert(data);
							}
						}
						else
						{
							window.location.reload(true);
						}
					},"text");
				}
			};
		}
	});
});
function downloadFile(url){
	$("#downloadiframe").attr("src",url);
}