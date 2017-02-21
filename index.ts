class Page {
        count: number;
        pageTitle: string;
        scripts = [];
        styles = [];
        children = [];
        constructor(title: string){
            this.pageTitle = title;

            this.styles.push('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
            this.scripts.push("https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js");
            this.scripts.push('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js');
        }
        
        add(item) {
            this.children.push(item);
        }

        build () {
            var Html = "<!DOCTYPE Html>";
            Html += '<Html lang="en">';
            Html += '<head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8">';
            Html += '<title>' + this.pageTitle + '</title>';
            this.styles.forEach(function(style){
                Html += '<link href="' + style + '" rel="stylesheet">';
            });
            this.scripts.forEach(function(script){
                Html += '<script src="' + script + '"></script>';
            });
            Html += '</head><body>';
            this.children.forEach(function(element){
                Html = Html + element.build();
            });
            Html += '</body>';
            return Html;
        }
}
class nodeBase {
    HtmlNodeBase:string;
    classList = [];
    attributeList = [];
    constructor(node){
        this.setNodeBase(node);
    }
    setNodeBase(node){
        this.HtmlNodeBase = node;
    }

    addClass(newClass){
        this.classList.push(newClass)
    }

    removeClass(oldClass){
        for(var i = this.classList.length - 1; i >= 0; i--) {
            if(this.classList[i] === oldClass) {
                this.classList.splice(i, 1);
            }
        }
    }

    addAttribute(name, value){
        this.attributeList.push({
            name: name,
            value: value
        })
    }
}
class componentBase extends nodeBase{

    children = [];

    constructor(node, innerHtml = null){
        super(node);
        if(innerHtml != null){
            this.add(new rawHtml(innerHtml));
        }
    }

    add(child){
        this.children.push(child);
    }

    build(){
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function(nextClass){Html += nextClass + ' '});
        Html += '" ';
        this.attributeList.forEach(function(attribute){Html += attribute['name'] + '="' + attribute['value'] + '" '});
        Html += '>';
        this.children.forEach(function(child){Html += child.build()});
        Html += '</' + this.HtmlNodeBase + '>';
        return Html;

    }
}
class rawHtml{
    Html;
    constructor(Html){
        this.Html = Html;
    }
    setHtml(Html){
        this.Html = Html;
    }
    build(){
        return this.Html;
    }

}
class badge extends componentBase{
    constructor(value){
        super("span", value);
        this.addClass("badge");
    }
}
class breadcrumbs extends componentBase{
   constructor(){
       super("ul");
       this.addClass("breadcrumb");
   } 
   add(text: string, href = "#", special = null){
       
       var Html = '<li';
       if(special == "active"){
           Html += ' class="active">' + text + '</li>';
       }
       else{
           Html += '> <a href="' + href + '">' + text + '</a></li>'
       }
       super.add(new rawHtml(Html));
   }
}
class button extends componentBase{
    constructor(text:string, type = "default", special = ""){
        super("button");
        this.addAttribute("type", "button");
        this.addClass("btn");
        this.addClass("btn-" + type);
        if(special.indexOf("xs") > -1 || special.indexOf("extrasmall") > -1 || special.indexOf("extra-small") > -1 || special.indexOf("extra small") > -1){this.addClass("btn-xs");}
        else if(special.indexOf("small") > -1 || special.indexOf("sm") > -1){this.addClass("btn-sm");}
        else if(special.indexOf("large") > -1 || special.indexOf("lg") > -1){this.addClass("btn-lg");}
        else if(special.indexOf("medium") > -1 || special.indexOf("md") > -1){this.addClass("btn-md");}
        if(special.indexOf("block") > -1){this.addClass("btn-block");}
        if(special.indexOf("active") > -1){this.addClass("active");}
        else if(special.indexOf("disabled") > -1){this.addClass("disabled");}
        this.add(new rawHtml(text));
    }

}
class buttonGroup extends componentBase{
    gptype:string;
    constructor(size = "md", gptype = ''){
        super("div");

        this.gptype = gptype;

        if(gptype == "verticle"){this.addClass("btn-group-vertical");}
        else{this.addClass("btn-group");
                if(size != 'none'){this.addClass("btn-group-" + size);}
        }
        if(gptype == "justified"){this.addClass("btn-group-justified");}
    }
    add(button: button){
        if(this.gptype == "justified"){
            var bGroup = new buttonGroup("none");
            bGroup.add(button);
            this.children.push(bGroup);
        }
        else{
            this.children.push(button);
        }
    }
}
class col extends componentBase{
    constructor(size = "xs", width = 12){
        super("div");
        this.addClass("col-" + size + "-" + width);

    }
}
class collapse extends componentBase{ 
    colbutton;
    constructor(id, text, type = "default", special = ""){
        super("div");
        this.addAttribute("id", id);
        this.addClass("collapse");
        if(special.indexOf("open") > -1){this.addClass("in");}

        this.colbutton = new button(text, type);
        this.colbutton.addAttribute("data-toggle", "collapse");
        this.colbutton.addAttribute("data-target", "#" + id);
    }

    build(){
        return this.colbutton.build() + super.build();
    }

}
class container extends componentBase{
    constructor(type = ""){
        super("div");
        if(type == "fluid"){this.addClass("contained-fluid");}
        else{this.addClass("container");}
    }
}
class dropdown extends componentBase{
    list;
    button;
    constructor(text, navoptions = false){
        if(navoptions){
            super("li");
            this.button = new componentBase("a");
            this.button.addAttribute("href", "#");
            this.button.add(new rawHtml(text + ' <span class="glyphicon glyphicon-chevron-down"></span>'));
        }
        else{  
            super("div");
            this.button = new button(text + ' <span class="glyphicon glyphicon-chevron-down"></span>', "primary");
        }
        this.button.addAttribute("data-toggle", "dropdown");
        this.button.addClass("dropdown-toggle");
        super.add(this.button);
        this.addClass("dropdown");
        this.list = new componentBase("ul");
        this.list.addClass("dropdown-menu");
        super.add(this.list);
    }

    add(text: string, href = "#", special = null){
        switch(special){
            case null:
                this.list.add(new rawHtml('<li><a href="' + href + '">' + text + '</a></li>'));
                break;
            case "divider":
                this.list.add(new rawHtml('<li class="divider"></li>'));
                break;
            case "header":
                this.list.add(new rawHtml('<li class="dropdown-header">' + text + '</li>'));
                break;
            case "disabled":
                this.list.add(new rawHtml('<li class="disabled"><a href="' + href + '">' + text + '</a></li>'));
                break;
            default:
                this.list.add(new rawHtml('<li><a href="' + href + '">' + text + '</a></li>'));
                break;
        }

    }
}
class dynamicPills extends componentBase{
    contentDiv = [];
    constructor(special = ""){
        super("ul");
        this.addClass("nav");
        this.addClass("nav-pills");
        if(special = "justified"){this.addClass("nav-justified");}
    }

    add(text, active = false){
        var item = new componentBase("li");
        item.add(new rawHtml('<a data-toggle="pill" href="#' + text + '">' + text + '</a>'));
        
        this.contentDiv.push(new componentBase("div"));
        this.contentDiv[text] = this.contentDiv.length -1;
        this.contentDiv[this.contentDiv[text]].addAttribute('id', text);
        this.contentDiv[this.contentDiv[text]].addClass("tab-pane");
        if(active){
            item.addClass("active");
            this.contentDiv[this.contentDiv[text]].addClass("in");
            this.contentDiv[this.contentDiv[text]].addClass("active");
        }
        super.add(item);
    }
    addContent(text, child){

        this.contentDiv[this.contentDiv[text]].add(child);
    }
    build(){
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function(nextClass){
            Html += nextClass + ' ';
        });
        Html += '" ';
        
        this.attributeList.forEach(function(attribute){
            Html += attribute['name'] + '="' + attribute['value'] + '" ';
        });
        Html += '>';
        this.children.forEach(function(child){
            Html += child.build();
        });
        Html += '</' + this.HtmlNodeBase + '> <div class="tab-content">';
        this.contentDiv.forEach(function(div){
            Html += div.build();
        }); 
        Html += '</div>';
        return Html;
    }

}
class dynamicTabs extends componentBase{
    contentDiv = [];
    constructor(special = null){
        super("ul");
        this.addClass("nav");
        this.addClass("nav-tabs");
        if(special = "justified"){this.addClass("nav-justified");}
    }
    add(text, active = false){
        var item = new componentBase("li");
        item.add(new rawHtml('<a data-toggle="pill" href="#' + text + '">' + text + '</a>'));       
        this.contentDiv.push(new componentBase("div"));
        this.contentDiv[text] = this.contentDiv.length -1;
        this.contentDiv[this.contentDiv[text]].addAttribute('id', text);
        this.contentDiv[this.contentDiv[text]].addClass("tab-pane");
        if(active){
            item.addClass("active");
            this.contentDiv[this.contentDiv[text]].addClass("in");
            this.contentDiv[this.contentDiv[text]].addClass("active");
        }
        super.add(item);
    }
    addContent(text, child){
        this.contentDiv[this.contentDiv[text]].add(child);

    }
    build(){
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function(nextClass){
            Html += nextClass + ' ';
        });
        Html += '" ';
        
        this.attributeList.forEach(function(attribute){
            Html += attribute['name'] + '="' + attribute['value'] + '" ';
        });
        Html += '>';
        this.children.forEach(function(child){
            Html += child.build();
        });
        Html += '</' + this.HtmlNodeBase + '> <div class="tab-content">';
        this.contentDiv.forEach(function(div){
            Html += div.build();
        }); 
        Html += '</div>';
        return Html;
    }

}
class form extends componentBase{
    constructor(type = '', action = '', method = 'POST'){
        super("form");
        if(type == 'inline'){
            this.addClass('form-inline');
        }
        else if(type = 'horizontal'){
            this.addClass('form-horizontal');
        }

        this.addAttribute('action', action);
        this.addAttribute('method', method);
    }
}
class image extends componentBase{
    constructor(src, type = "responsive", alt = "image", width = -1, height = -1){
        super("img");
        this.addAttribute("src", src);
        this.addAttribute("alt", alt);
        this.addClass("img-" + type);
        if(width > 0) this.addAttribute("width", width);
        if(height > 0) this.addAttribute("height", height);
    }
}
class input{	

		inputType;
		label;
		style;
		inputName;
		other;
		constructor(inputType, label, name, style="", other = null){
			switch(inputType){
			case "text":
			case "password":
			case "textarea":
			case "checkbox":
			case "radio":
			case "select":
				this.inputType = inputType;
				this.label = label;
				this.style = style;
				this.inputName = name;
				this.other = other;
			}
		}	
		build(){
            var div = new componentBase("div");
            var label = new componentBase("label");	
			switch(this.inputType){
			case "text":
			case "password":
				div.addClass("form-group");
				label.addAttribute("for", this.inputName);
			    label.add(new rawHtml(this.label));
				div.add(label);
				div.add(new rawHtml('<input type="' + this.inputType + '" class="form-control" id="' + this.inputName + '" name="' + this.inputName + '">'));
				return div.build();
			case "textarea":
				div.addClass("form-group");
				label.addAttribute("for", this.inputName);
				label.add(new rawHtml(this.label));
				div.add(label);
				div.add(new rawHtml('<textarea rows="' + this.other + '" class="form-control" id="' + this.inputName + '" name="' + this.inputName + '"></textarea>'));
				return div.build();
			case "checkbox":
			case "radio":
				if(this.style == "inline"){
				div = new rawHtml('<label class="' + this.inputType + '-inline"><input type="' + this.inputType + '" id="' + this.inputName + '" name="' + this.inputName + '" value="'+ this.other +'">' + this.label + '</label>');
				}
				else{
				div.addClass(this.inputType);
                div.add(new rawHtml('<label class="' + this.inputType + '-inline"><input type="' + this.inputType + '" id="' + this.inputName + '" name="' + this.inputName + '" value="' + this.other +'">' + this.label + '</label>'));
				}
				return div.build();
			case "select":
				div.addClass("form-group");
				label.addAttribute("for", this.inputName);
				label.add(new rawHtml(this.label));
				div.add(label);
				var select = new componentBase("select");
				select.addClass("form-control");
				select.addAttribute("id", this.inputName);
				select.addAttribute("name", this.inputName);
				if(this.style == "multiple"){
				select.addAttribute("multiple", "");
				}
				this.other.foreach(function(option){
				    select.add(new componentBase("option", option));
                });
				div.add(select);
				return div.build();
			}
		}
}
class jumbotron extends componentBase{
    constructor(){
        super("div");
        this.addClass("jumbotron");
    }

}
class label extends componentBase{
    constructor(text, labelClass = "default"){
        super("span");
        this.addClass("label");
        this.addClass("label" + labelClass);
        this.add(new rawHtml(text));
    }

}
class listGroup extends componentBase{
    constructor(links = false){
        if(links){super("div");}
        else{super("ul");}
        this.addClass('list-group');
    }

    add(child){
        super.add(child);
        child.makeLink();
    }

}
class listGroupItem extends componentBase{
    href;
    constructor(href = "#", special = null){
        super("li");
        this.href = href;
        this.addClass("list-group-item");
        if(special.indexOf("success") > -1) this.addClass("list-group-item-success");
        else if(special.indexOf("info") > -1) this.addClass("list-group-item-info");
        else if(special.indexOf("warning") > -1) this.addClass("list-group-item-warning");
        else if(special.indexOf("danger") > -1) this.addClass("list-group-item-danger");
        if(special.indexOf("active") > -1) this.addClass("active");
        else if(special.indexOf("disabled") > -1) this.addClass("disabled");
    }
    
    makeLink(){
        this.HtmlNodeBase = ("a");
        this.addAttribute("href", this.href);
    }

}
class mediaObject extends componentBase{
    child;
    constructor(href, location, width){
        super("div");
        this.addClass("media");
        var mediaDiv = new componentBase("div");
        if(location.indexOf("top") > -1) mediaDiv.addClass("media-top");
        else if(location.indexOf("middle") > -1) mediaDiv.addClass("media-middle");
        else if(location.indexOf("bottom") > -1) mediaDiv.addClass("media-bottom");
        mediaDiv.add(new image(href, "Media Object", "", width))
        this.child = new componentBase("div");
        this.child.addClass("media-body");
        if(location.indexOf("right") > -1){
            mediaDiv.addClass("media-right");
            super.add(mediaDiv);
            super.add(this.child);
        }
    }
    add(child){
        this.child.add(child);
    }

}
class navBar extends componentBase{
     innerDiv;
     list;
     collapse;
     collapseDiv;
     rightList;
     constructor(special = "", headertext = "Website", href = "#"){
        super("nav");
        this.innerDiv = new componentBase("div");
        this.innerDiv.addClass("container-fluid");
        this.add(this.innerDiv);
        this.innerDiv.add(new rawHtml('<div class="navbar-header">'));
        if((special.indexOf("collapse") > -1) !==false){
            this.collapse = true;
            this.collapseDiv = new componentBase("div");
            this.collapseDiv.addClass("collapse");
            this.collapseDiv.addClass("navbar-collapse");
            this.collapseDiv.addAttribute("id", "navbar");
            this.innerDiv.add(new rawHtml('<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>'));
        }
        this.innerDiv.add(new rawHtml('<a class="navbar-brand" href="' + href + '">' + headertext + '</a></div>'));
        this.list = new componentBase("ul");
        this.list.addClass("nav");
        this.list.addClass("navbar-nav");
        this.rightList = new componentBase("ul");
        this.rightList.addClass("nav");
        this.rightList.addClass("navbar-nav");
        this.rightList.addClass("navbar-right");
        if((special.indexOf("collapse") > -1) !==false){
            this.innerDiv.add(this.collapseDiv);
            this.collapseDiv.add(this.list);
            this.collapseDiv.add(this.rightList);
        }
        else{
            this.innerDiv.add(this.list);
            this.innerDiv.add(this.rightList);
            
        }

        this.addClass("navbar");
        if(special.indexOf("fixed-top") > -1) this.addClass("navbar-fixed-top");
        if(special.indexOf("fixed-bottom") > -1) this.addClass("navbar-fixed-bottom");
        if(special.indexOf("inverse") > -1) this.addClass("navbar-inverse");
        else this.addClass("navbar-default");
    }
     addLink(text, href = "#", active = false){
        var item = new componentBase("li");
        if(active) this.addClass("active");
        item.add(new rawHtml('<a href="' + href + '">'+ text + '</a>'));
        this.list.add(item);
    }
     addTab(text, href = "#", active = false){
        var item = new componentBase("li");
        if(active) item.addClass("active");
        item.add(new rawHtml('<a href="' + href + '">' + text + '</a>'));
        this.list.add(item);	
    }
     addRightLink(text, href = "#", active = false){
        var item = new componentBase("li");
        if(active) item.addClass("active");
        item.add(new rawHtml('<a href="' + href + '">' + text + '</a>'));
            this.rightList.add(item);	
    }
     addItem(item){
        this.list.add(item);
    }
}
class pager extends componentBase{
    constructor(){
        super("ul");
        this.addClass("pager");
    }
    add(text, href="#", special = null){
        var html = '<li';
		if(special == "previous"){
			html += ' class="previous"';
		}
		if(special =="next"){
			html += ' class="next"';
		}
		html += '><a href="' + href + '">'+ text;
		html += '</a></li>';
        super.add(new rawHtml(html));
    }
}
class pagination extends componentBase{
    constructor(size = null){
        super("ul");
        this.addClass("pagination");
        switch(size){
            case "sm":
            case "small":
                this.addClass("pagination-sm");
                break;
            case "lg":
            case "large":
                this.addClass("pagination-lg");
                break;
        }
    }
    add(text, href="#", special = null){
        var html = '<li';
		if(special == "disabled"){
			html += ' class="disabled"';
		}
		if(special =="active"){
			html += ' class="active"';
		}
		html += '><a href="' + href + '">'+ text;
		html += '</a></li>';
        super.add(new rawHtml(html));
    }
}
class panel extends componentBase{
    header;
    footer;
    collapsible;
    id;
    constructor(contextual = "default", collapsible = false, id = null){
        super("div");
        this.addClass("panel");
        this.addClass("panel-" + contextual);
        this.collapsible = collapsible;
        if(id != null) this.id = id;
    }

    addHeader(header){
        if(typeof(header) == "string") this.header = new componentBase("div", header);
        else this.header = header;
        this.header.addClass("panel-heading");
        if(this.collapsible){
            this.header.addAttribute("data-toggle", "collapse");
            this.header.addAttribute("href", "#" + this.id);
            this.header.addAttribute("style", "cursor:pointer");
        }
    }

    addFooter(footer){
        this.footer = footer;
        this.footer.addClass("panel-footer");
    }

    build(){
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function(nextClass){Html += nextClass + ' '});
        Html += '" ';
        this.attributeList.forEach(function(attribute){Html += attribute['name'] + '="' + attribute['value'] + '" '});
        Html += '>';
        Html += this.header.build();
        if(this.collapsible) Html += '<div id="' + this.id + '" class="panel-collapse collapse">';
        this.children.forEach(function(child){
            if(child.HtmlNodeBase == "div") child.addClass("panel-body");
            Html += child.build()});
        Html += this.footer.build();
        if(this.collapsible) Html += "</div>";
        Html += '</' + this.HtmlNodeBase + '>';
        return Html;
    }
}
class pills extends nodeBase{
    children = [];
    constructor(special = ""){
        super("ul");
        this.addClass("nav");
        this.addClass("nav-pills");
        if(special == "justified") this.addClass("nav-justified");
        else if(special == "stacked") this.addClass("nav-stacked");
    }

    add(text, href = "#", active = false){
        var item = new componentBase("li");
        if(active) this.addClass("active");
        item.add(new rawHtml('<a href="' + href + '">' + text + '</a>'));
        this.children.push(item);
    } 

    addDropdown(item){
        this.children.push(item);
    }

    build(){
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function(nextClass){Html += nextClass + ' '});
        Html += '" ';
        this.attributeList.forEach(function(attribute){Html += attribute['name'] + '="' + attribute['value'] + '" '});
        Html += '>';
        this.children.forEach(function(child){Html += child.build()});
        Html += '</' + this.HtmlNodeBase + '>';
        return Html;

    }

}
class progressBar extends nodeBase{
    children = [];
    constructor(){
        super("div");
        this.addClass("progress");
    }

    add(percent, type = "success", style = "default", text = null){
        var html = '<div class="progress-bar progress-bar-' + type;
        if(style == "striped") html += ' progress-bar-striped';
        else if(style == "active") html += ' progress-bar-striped active';
        html += '" role="progressbar" style="width:' + percent + '%">';
		html += text;
		html += '</div>';
		this.children.push(new rawHtml(html));
    }

    build(){
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function(nextClass){Html += nextClass + ' '});
        Html += '" ';
        this.attributeList.forEach(function(attribute){Html += attribute['name'] + '="' + attribute['value'] + '" '});
        Html += '>';
        this.children.forEach(function(child){Html += child.build()});
        Html += '</' + this.HtmlNodeBase + '>';
        return Html;
    }
}
class row extends componentBase{
    constructor(){
        super("div");
        this.addClass("row");
    }
}
class table{
    responsive;
    headRow;
    rows = [];
    classList = [];
    constructor(special = ''){
        this.classList.push('table');
        this.responsive = (special.indexOf('responsive') > -1);
        if(special.indexOf("striped") > -1)this.classList.push('table-striped');
        if(special.indexOf("bordered") > -1)this.classList.push('table-bordered');
        if(special.indexOf("hover") > -1)this.classList.push('table-hover');
        if(special.indexOf("striped") > -1)this.classList.push('table-condensed');
    }
    addRow(row){
        this.rows.push(row);
    }
    addHeadRow(row){
        this.headRow = row;
    }
    build(){
        var html = '';
        if(this.responsive) html += '<div class="table-responsive">';
        html += '<table class="';
        this.classList.forEach(function(className){
            html += ' ' + className;
        });
        html += '">';
        if(typeof this.headRow != 'unidentified'){
            html += '<thead>';
            html += this.headRow.build(true);
            html += '</thead>';
        }
        html += '<tbody>';
        this.rows.forEach(function(row){
            html += row.build();
        });
        html += '</tbody></table>';
        if(this.responsive) html += '</div>';
        return html;
    }

}
class tableRow{
    context;
    cells = [];
    constructor(cells = [], context = ""){
        this.context = context;
        this.cells = cells;
    }

    build(head = false){
        var node;
        if(head) node = 'th';
        else node = 'td';
        var html = '<var class="' + this.context + '">';
        this.cells.forEach(function(cell){
            html += '<' + node + '>'  + cell + '</' + node + '>';
        });
        html += '</tr>';
        return html;
    }
}
class tabs extends nodeBase{
    children = [];
    constructor(special=""){
        super("ul");
        this.addClass("nav");
        this.addClass("nav-tabs");
        if(special == "justified") this.addClass("nav-justified");
    }
    add(text, href = '#', active = false){
        var item = new componentBase("li");
        if(active) this.addClass("active");
        item.add(new rawHtml('<a href="' + href + '">' + text + '</a>'));
        this.children.push(item);
    } 
    addDropdown(item){
        this.children.push(item);
    }
    build(){
        var Html = '<';
        Html += this.HtmlNodeBase + ' class="';
        this.classList.forEach(function(nextClass){Html += nextClass + ' '});
        Html += '" ';
        this.attributeList.forEach(function(attribute){Html += attribute['name'] + '="' + attribute['value'] + '" '});
        Html += '>';
        this.children.forEach(function(child){Html += child.build()});
        Html += '</' + this.HtmlNodeBase + '>';
        return Html;
    }
}

class nil extends nodeBase{
    children = [];
    add(child){
        this.children.push(child);
    }

    build(){
        
        var Html = "";
        this.children.forEach(function(child){
            Html += child.build()});
        return Html;

    }

}
var exports;
exports.Page = Page;
exports.nodeBase = nodeBase;
exports.componentBase = componentBase;
exports.rawHtml = rawHtml;
exports.badge = badge;
exports.breadcrumbs = breadcrumbs;
exports.button = button;
exports.buttonGroup = buttonGroup;
exports.col = col;
exports.collapse = collapse;
exports.container = container;
exports.dropdown = dropdown;
exports.dynamicPills = dynamicPills;
exports.dynamicTabs = dynamicTabs;
exports.form = form;
exports.image = image;
exports.input = input;
exports.jumbotron = jumbotron;
exports.label = label;
exports.listGroup = listGroup;
exports.listGroupItem = listGroupItem;
exports.mediaObject = mediaObject;
exports.navBar = navBar;
exports.pager = pager;
exports.pagination = pagination;
exports.panel = panel;
exports.pills = pills;
exports.progressBar = progressBar;
exports.row = row;
exports.table = table;
exports.tableRow = tableRow;
exports.tabs = tabs;
exports.nil = nil;