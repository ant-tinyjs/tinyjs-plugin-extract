version = 1.0.0
gitlab  = git@gitlab.alipay-inc.com:tiny-plugin/extract.git
github  = https://github.com/ant-tinyjs/tinyjs-plugin-extract.git

qtdeploy:
	@git remote set-url origin ${gitlab}
	@git add -A .
	@git commit -am 'update'
	@git tag ${version}
	@git push origin master --tags
	@tnpm run qtdeploy
