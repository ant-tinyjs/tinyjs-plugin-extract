version = 1.0.4
gitlab  = git@gitlab.alipay-inc.com:tiny-plugin/tinyjs-plugin-extract.git
github  = https://github.com/ant-tinyjs/tinyjs-plugin-extract.git

qtdeploy:
	@git remote set-url origin ${gitlab}
	@git add -A .
	@git commit -am 'update'
	@git tag ${version}
	@git push origin master --tags
	@qtdeploy all
	@git remote set-url origin ${github}
